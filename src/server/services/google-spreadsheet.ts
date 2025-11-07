import {
    GoogleSpreadsheetWorksheet,
    GoogleSpreadsheet as Sheet,
} from "google-spreadsheet";
import { JWT } from "google-auth-library";
import creds from "../../../config/google-jwt.json";

export class GoogleSpreadsheet {
    constructor(private sheet: GoogleSpreadsheetWorksheet) {}

    static async init() {
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new Sheet(process.env.SHEET_ID!, serviceAccountAuth);

        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];

        if (!sheet)
            throw new GoogleSheetUndefined("Google Sheet came undefined");

        return new this(sheet);
    }

    async addStudent(studentName: string, grade: string) {
        await this.sheet.loadHeaderRow();
        const headers = this.sheet.headerValues;

        if (!headers.includes(studentName)) {
            headers.push(studentName);
            await this.sheet.setHeaderRow(headers);
            console.log(`Coluna criada: ${studentName}`);
        }

        const rowData: Record<string, string> = {};
        rowData[studentName] = grade;

        await this.sheet.addRow(rowData);
        console.log(`Nota adicionada para ${studentName}: ${grade}`);
    }
}

export class GoogleSheetUndefined extends Error {}
