import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PhotoSubmission {
    photoUrl: string;
    timestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    email?: string;
}
export interface WakeUpSettings {
    wakeUpTime: Time;
    isEnabled: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteUserData(user: Principal): Promise<void>;
    getAllUserRecords(): Promise<Array<[Principal, WakeUpSettings, bigint]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPhotoSubmissions(): Promise<Array<PhotoSubmission>>;
    getUserPhotoSubmissions(user: Principal): Promise<Array<PhotoSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWakeUpTime(): Promise<WakeUpSettings | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setWakeUpTime(settings: WakeUpSettings): Promise<void>;
    submitPhoto(photoUrl: string): Promise<void>;
}
