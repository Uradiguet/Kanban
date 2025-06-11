export default class User {
    id: string | null = null;
    username: string | null = null;
    email: string | null = null;
    firstname: string | null = null;
    lastname: string | null = null;

    constructor(data?: Partial<User>) {
        if (data) {
            this.id = data.id || null;
            this.username = data.username || null;
            this.email = data.email || null;
            this.firstname = data.firstname || null;
            this.lastname = data.lastname || null;
        }
    }
}