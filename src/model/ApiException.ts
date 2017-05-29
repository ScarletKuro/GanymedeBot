export class ApiException extends Error {
    public constructor(message: string) {
        super(message);
    }
}