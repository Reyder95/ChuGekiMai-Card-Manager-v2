declare global {
    interface Window {
        electronAPI: {
            getAppPath: () => Promise<string>;
            readJsonFile: (fileName: string) => Promise<any>;
            writeJsonFile: (fileName: string, data: any) => Promise<void>;
            writeAimeFile: (fileName: string, cardId: string) => Promise<void>;
            openSettings: () => Promise<void>;
            onGlobalShortcut: (callback: (event: any, action: string) => void) => void;
            storeGet: (key: any) => Promise<any>;
            storeSet: (key: any, value: any) => Promise<void>;
            storeDelete: (key: any) => Promise<void>;
            setCard: (callback: (event: any, key: string) => void) => void;
        };
    }
}

// This is needed for TypeScript to recognize the file as a module
export {};