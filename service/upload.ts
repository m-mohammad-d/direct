import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export type FileUploadPayload = {
  uri: string;
  name: string;
  type: string;
};
const uploadFile = async (file: FileUploadPayload) => {
  const formData = new FormData();
  const token = await getToken();

  formData.append("image", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob); 

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return res.json();
};

export { uploadFile };
