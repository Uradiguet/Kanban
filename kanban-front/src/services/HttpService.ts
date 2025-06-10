type HttpResponse<T = any> = {
    status: number;
    data: T | null;
    error?: string;
};

export default class HttpService {
    static async get<T = any>(url: string, headers?: RequestInit): Promise<HttpResponse<T>> {
        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                return { status: response.status, data: null, error: `Error ${response.status}: ${response.statusText}` };
            }
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            return { status: 500, data: null, error: "Network error" };
        }
    }

    private static async request<T = any>(url: string, method: string, data?: any, headers?: RequestInit): Promise<HttpResponse<T>> {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data ? JSON.stringify(data) : undefined,
                ...headers
            });

            if (!response.ok) {
                return { status: response.status, data: null, error: `Error ${response.status}: ${response.statusText}` };
            }

            const respData = await response.json();
            return { status: response.status, data: respData };
        } catch (error) {
            return { status: 500, data: null, error: "Network error" };
        }
    }

    static async post<T = any>(url: string, data: any, headers?: RequestInit): Promise<HttpResponse<T>> {
        return await this.request(url, 'POST', data, headers);
    }

    static async put<T = any>(url: string, data: any, headers?: RequestInit): Promise<HttpResponse<T>> {
        return await this.request(url, 'PUT', data, headers);
    }

    static async delete(url: string, headers?: RequestInit): Promise<HttpResponse<null>> {
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                ...headers
            });

            if (!response.ok) {
                return { status: response.status, data: null, error: `Error ${response.status}: ${response.statusText}` };
            }

            return { status: response.status, data: null };
        } catch (error) {
            return { status: 500, data: null, error: "Network error" };
        }
    }
}
