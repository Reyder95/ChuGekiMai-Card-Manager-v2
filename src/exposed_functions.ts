import { IpcMainInvokeEvent } from "electron";
import path from "path";
import * as fs from 'fs'

export const writeToAimeFile = (event: IpcMainInvokeEvent, fileName: string, cardId: string, app: any) => {
    let exeDirectory;

    if (app.isPackaged)
        exeDirectory = path.join(app.getAppPath(), '../../..')
    else
        exeDirectory = app.getAppPath();

    const filePath = path.join(exeDirectory, fileName);

    try {
        fs.writeFileSync(filePath, cardId, 'utf-8');
    } catch (error: any) {
        return { error: error.message }
    }
}