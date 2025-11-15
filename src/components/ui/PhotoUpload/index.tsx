import { useEffect, useRef, useState } from "react";
import "./PhotoUpload.css";

interface PhotoUploadProps {
	label: string;
	onPhotoSelect: (base64: string, filename: string) => void;
	required?: boolean;
	currentPhoto?: string;
	maxSizeInMB?: number;
	acceptedFormats?: string[];
}

/**
 * Photo upload component with preview, validation, and accessibility features
 *
 * @example Basic usage
 * ```tsx
 * <PhotoUpload
 *   label="Profile Photo"
 *   onPhotoSelect={(base64, filename) => {
 *     console.log('Photo selected:', filename);
 *   }}
 * />
 * ```
 *
 * @example With required field
 * ```tsx
 * <PhotoUpload
 *   label="ID Card Photo"
 *   onPhotoSelect={(base64, filename) => {
 *     setIdCard({ base64, filename });
 *   }}
 *   required
 * />
 * ```
 *
 * @example With custom validation
 * ```tsx
 * <PhotoUpload
 *   label="Company Logo"
 *   onPhotoSelect={(base64, filename) => {
 *     uploadToServer(base64);
 *   }}
 *   maxSizeInMB={2}
 *   acceptedFormats={['image/png', 'image/jpeg']}
 * />
 * ```
 *
 * @example With existing photo (edit mode)
 * ```tsx
 * <PhotoUpload
 *   label="Avatar"
 *   currentPhoto={user.avatar}
 *   onPhotoSelect={(base64, filename) => {
 *     updateAvatar(base64);
 *   }}
 * />
 * ```
 *
 * @example In a form
 * ```tsx
 * function UserForm() {
 *   const [photoData, setPhotoData] = useState({ base64: '', filename: '' });
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (!photoData.base64) {
 *       alert('Photo is required');
 *       return;
 *     }
 *     // Submit form data
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <PhotoUpload
 *         label="Profile Picture"
 *         onPhotoSelect={(base64, filename) => {
 *           setPhotoData({ base64, filename });
 *         }}
 *         required
 *       />
 *       <button type="submit">Save</button>
 *     </form>
 *   );
 * }
 * ```
 */

export function PhotoUpload({
	label,
	onPhotoSelect,
	required = false,
	currentPhoto,
	maxSizeInMB = 5,
	acceptedFormats = ["image/jpeg", "image/png", "image/jpg"],
}: PhotoUploadProps) {
	const [preview, setPreview] = useState<string | null>(currentPhoto || null);
	const [filename, setFilename] = useState<string>("");
	const [error, setError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		return () => {
			if (preview?.startsWith("blob:")) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const validateFile = (file: File): string | null => {
		if (!acceptedFormats.includes(file.type)) {
			return `Please upload a valid image (${acceptedFormats.join(", ")})`;
		}

		const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
		if (file.size > maxSizeInBytes) {
			return `File size must be less than ${maxSizeInMB}MB`;
		}

		return null;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError("");

		const validationError = validateFile(file);
		if (validationError) {
			setError(validationError);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			setPreview(base64);
			setFilename(file.name);
			onPhotoSelect(base64, file.name);
		};

		reader.onerror = () => {
			setError("Failed to read file. Please try again.");
		};

		reader.readAsDataURL(file);
	};

	const handleRemove = () => {
		setPreview(null);
		setFilename("");
		setError("");
		onPhotoSelect("", "");

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="photo-upload-container">
			<label
				htmlFor="photo-upload"
				className={`photo-upload-label ${required ? "required" : ""}`}
			>
				{label}
			</label>

			<div className="photo-upload-wrapper">
				{!preview ? (
					<>
						<label htmlFor="photo-upload" className="photo-upload-input-label">
							<input
								id="photo-upload"
								ref={fileInputRef}
								type="file"
								accept={acceptedFormats.join(",")}
								onChange={handleFileChange}
								className="photo-upload-input"
								required={required}
								aria-label={label}
							/>
							<svg
								className="photo-upload-icon"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
								aria-hidden="true"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="photo-upload-text">Choose Photo (JPG, PNG)</span>
							<span className="photo-upload-hint">Max {maxSizeInMB}MB</span>
						</label>
						{error && (
							<p className="photo-upload-error" role="alert">
								{error}
							</p>
						)}
					</>
				) : (
					<div className="photo-preview">
						<img
							src={preview}
							alt={`Preview of ${filename}`}
							className="photo-preview-image"
						/>
						<div className="photo-preview-info">
							<p className="photo-preview-filename">{filename}</p>
							<button
								type="button"
								onClick={handleRemove}
								className="photo-preview-remove"
								aria-label={`Remove ${filename}`}
							>
								Remove photo
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
