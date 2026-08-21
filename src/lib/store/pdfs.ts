const DB_NAME = "bhc-matter-tracker";
const STORE = "pdfs";

export type StoredPdf = {
  key: string;
  matterId: string;
  filename: string;
  mime: string;
  data: ArrayBuffer;
  savedAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function pdfKey(matterId: string, orderKey: string) {
  return `${matterId}::${orderKey}`;
}

export async function savePdf(input: {
  matterId: string;
  orderKey: string;
  filename: string;
  base64: string;
}) {
  const binary = atob(input.base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const rec: StoredPdf = {
    key: pdfKey(input.matterId, input.orderKey),
    matterId: input.matterId,
    filename: input.filename,
    mime: "application/pdf",
    data: bytes.buffer,
    savedAt: new Date().toISOString(),
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(rec, rec.key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return rec.key;
}

export async function getPdf(matterId: string, orderKey: string) {
  const db = await openDb();
  const rec = await new Promise<StoredPdf | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(pdfKey(matterId, orderKey));
    req.onsuccess = () => resolve(req.result as StoredPdf | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return rec;
}

export async function deletePdfsForMatter(matterId: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) return;
      const rec = cursor.value as StoredPdf;
      if (rec.matterId === matterId) cursor.delete();
      cursor.continue();
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export function downloadBuffer(filename: string, data: ArrayBuffer, mime: string) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function objectUrlFor(data: ArrayBuffer, mime = "application/pdf") {
  return URL.createObjectURL(new Blob([data], { type: mime }));
}
