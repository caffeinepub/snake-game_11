import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type WakeUpSettings = {
    wakeUpTime : Time.Time;
    isEnabled : Bool;
  };

  public type PhotoSubmission = {
    timestamp : Time.Time;
    photoUrl : Text;
  };

  public type UserData = {
    var settings : WakeUpSettings;
    var submissions : List.List<PhotoSubmission>;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userRecords = Map.empty<Principal, UserData>();

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Wake-up Settings Functions
  public shared ({ caller }) func setWakeUpTime(settings : WakeUpSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can set wake-up time");
    };

    switch (userRecords.get(caller)) {
      case (?userData) {
        userData.settings := settings;
      };
      case (null) {
        let newUserData : UserData = {
          var settings;
          var submissions = List.empty<PhotoSubmission>();
        };
        userRecords.add(caller, newUserData);
      };
    };
  };

  public query ({ caller }) func getWakeUpTime() : async ?WakeUpSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get wake-up time");
    };

    switch (userRecords.get(caller)) {
      case (?userData) { ?userData.settings };
      case (null) { null };
    };
  };

  // Photo Submission Functions
  public shared ({ caller }) func submitPhoto(photoUrl : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit photos");
    };

    let submission : PhotoSubmission = {
      timestamp = Time.now();
      photoUrl;
    };

    switch (userRecords.get(caller)) {
      case (?userData) {
        if (not userData.settings.isEnabled) {
          Runtime.trap("Wake-up feature is disabled");
        };

        userData.submissions.add(submission);
      };
      case (null) {
        Runtime.trap("Wake-up settings not found for user");
      };
    };
  };

  public query ({ caller }) func getPhotoSubmissions() : async [PhotoSubmission] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their photo submissions");
    };

    switch (userRecords.get(caller)) {
      case (?userData) { userData.submissions.toArray() };
      case (null) { [] };
    };
  };

  // Admin Functions
  public query ({ caller }) func getAllUserRecords() : async [(Principal, WakeUpSettings, Nat)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all user records");
    };
    let allRecords : [(Principal, UserData)] = userRecords.toArray();
    allRecords.map(
      func((principal, userData)) {
        (principal, userData.settings, userData.submissions.size());
      }
    );
  };

  public query ({ caller }) func getUserPhotoSubmissions(user : Principal) : async [PhotoSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' submissions");
    };

    switch (userRecords.get(user)) {
      case (?userData) { userData.submissions.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteUserData(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete user data");
    };

    userRecords.remove(user);
    userProfiles.remove(user);
  };
};
