/*
This is the enum for the error codes.
It is used to throw domain custom exceptions.
The error codes are used to identify the type of error that occurred.
Either add to this enum and will be automatically assigned a number which will be incremented,
or assign a number manually.
If you assign a number manually, you must ensure that the number is unique.
*/
export enum ErrorCodes {
  NOT_FOUND,
  ALREADY_EXISTS,
}
