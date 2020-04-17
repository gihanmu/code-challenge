import { UserStatus } from './user-status.enum';

export class User {
    id: number;
    name: string;
    dateOfBirth: string;
    email: string;
    status: UserStatus;
    hourlyRate: number;
}
