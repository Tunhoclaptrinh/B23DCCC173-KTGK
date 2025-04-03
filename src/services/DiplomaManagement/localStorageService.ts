// services/common/LocalStorageService.ts
export class LocalStorageService<T extends { id?: number }> {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private generateId(): number {
        const items = this.get();
        return items.length > 0
            ? Math.max(...items.map(item => item.id || 0)) + 1
            : 1;
    }

    save(data: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    get(): T[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    add(item: Omit<T, 'id'>): T {
        const items = this.get();
        const newItem = {
            ...item,
            id: this.generateId(),
            created_at: new Date(),
        } as unknown as T;
        items.push(newItem);
        this.save(items);
        return newItem;
    }

    update(id: number, updatedItem: Partial<T>): T | undefined {
        const items = this.get().map(item =>
            item.id === id
                ? { ...item, ...updatedItem, updated_at: new Date() }
                : item
        );
        this.save(items);
        return items.find(item => item.id === id);
    }

    delete(id: number): void {
        const items = this.get().filter(item => item.id !== id);
        this.save(items);
    }
}
