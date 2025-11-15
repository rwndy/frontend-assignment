export const isDataUri = (str: string): boolean => {
	return str.startsWith("data:");
};

export const isBase64 = (str: string): boolean => {
	if (!str || isDataUri(str)) return false;

	const base64Regex = /^[A-Za-z0-9+/]+=*$/;
	return base64Regex.test(str);
};

export const toImageSrc = (
	imageData: string,
	mimeType: string = "image/jpeg",
): string => {
	if (!imageData) return "";

	if (isDataUri(imageData)) {
		return imageData;
	}

	if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
		return imageData;
	}

	return `data:${mimeType};base64,${imageData}`;
};

export const detectMimeType = (imageData: string): string => {
	if (!imageData) return "image/jpeg";

	if (isDataUri(imageData)) {
		const match = imageData.match(/data:([^;]+);/);
		return match ? match[1] : "image/jpeg";
	}

	const base64 = imageData.substring(0, 50);

	if (base64.startsWith("/9j/") || base64.startsWith("iVBOR")) {
		return "image/jpeg";
	}

	if (base64.startsWith("iVBOR")) {
		return "image/png";
	}

	if (base64.startsWith("R0lGOD")) {
		return "image/gif";
	}

	if (base64.startsWith("UklGR")) {
		return "image/webp";
	}

	return "image/jpeg";
};

export const isValidImageData = (imageData: string): boolean => {
	if (!imageData || typeof imageData !== "string") return false;

	if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
		return true;
	}

	if (isDataUri(imageData)) {
		return imageData.includes("base64,");
	}

	return imageData.length > 10 && isBase64(imageData);
};

export const getImageSrc = (imageData: string | null | undefined): string => {
	if (!imageData) return "";

	try {
		const mimeType = detectMimeType(imageData);
		return toImageSrc(imageData, mimeType);
	} catch (error) {
		console.error("Error processing image data:", error);
		return "";
	}
};

export const preloadImage = (src: string): Promise<boolean> => {
	return new Promise((resolve) => {
		if (!src) {
			resolve(false);
			return;
		}

		const img = new Image();

		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);

		img.src = src;
	});
};

export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				const base64 = reader.result.split(",")[1];
				resolve(base64);
			} else {
				reject(new Error("Failed to read file"));
			}
		};

		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
};

export const fileToDataUri = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("Failed to read file"));
			}
		};

		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
};
