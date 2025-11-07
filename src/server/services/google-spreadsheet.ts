import {
    GoogleSpreadsheetWorksheet,
    GoogleSpreadsheet as Sheet,
} from "google-spreadsheet";
import { JWT } from "google-auth-library";

export class GoogleSpreadsheet {
    constructor(private sheet: GoogleSpreadsheetWorksheet) {}

    static async init(sheetId: string) {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new Sheet(sheetId, serviceAccountAuth);

        await doc.loadInfo();

        const sheet = doc.sheetsByTitle[process.env.SHEET!];

        if (!sheet)
            throw new GoogleSheetUndefined("Google Sheet came undefined");

        return new this(sheet);
    }

    async addStudent(studentName: string, grade: string) {
        this.sheet.addRows([{ [studentName]: grade }]);

        console.log(`ESTUDANTE ADICIONADO: ${studentName}`);
    }
}

export class GoogleSheetUndefined extends Error {}
