declare global {
    interface Window {
        electronAPI: {
            getAppPath: () => Promise<string>;
            readJsonFile: (fileName: string) => Promise<any>;
            writeJsonFile: (fileName: string, data: any) => Promise<void>;
            writeAimeFile: (fileName: string, cardId: string) => Promise<void>;
            openSettings: () => Promise<void>;
            onGlobalShortcut: (callback: (event: any, key: string) => void) => void;
            storeGet: (key: any) => Promise<any>;
            storeSet: (key: any, value: any) => Promise<void>;
        };
    }
}

// This is needed for TypeScript to recognize the file as a module
export {};