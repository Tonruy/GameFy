import { useCallback, useEffect, useState } from 'react'
import "./ImageModalSlider.css";

const ImageModalSlider = ({ isOpen, images, initialIndex, onClose }) => {

	const [currentIndex, setCurrentIndex] = useState(null);
	const hdImages = Array.isArray(images) ? images.filter(Boolean) : [];
	const hdImagesLength = hdImages.length;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (initialIndex < 0) {
			setCurrentIndex(0);
			return;
		}

		if (initialIndex >= hdImagesLength) {
			setCurrentIndex(hdImagesLength - 1);
			return;
		}

		setCurrentIndex(initialIndex);

	}, [isOpen, initialIndex, hdImagesLength])

	const goNext = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev === null) return 0;
			if (prev === hdImagesLength - 1) return 0;
			return prev + 1;
		});
	}, [hdImagesLength]);

	const goPrev = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev === null) return 0;
			if (prev === 0) return hdImagesLength - 1;
			return prev - 1;
		});
	}, [hdImagesLength]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (e) => {
			const { key } = e;

			if (key === "Escape") {
				onClose();
				return;
			}

			if (key === "ArrowRight") {
				goNext();
				return;
			}

			if (key === "ArrowLeft") {
				goPrev();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose, goNext, goPrev]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	if (!hdImagesLength) {
		return null;
	}

	if (currentIndex === null) {
		return null;
	}

	if (currentIndex < 0 || currentIndex >= hdImagesLength) {
		return null;
	}

	return (
		<div className="imgs-slider-overlay" onClick={onClose}>
			<div
				className="imgs-slider-modal"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label="Image slider modal"
			>
				<button
					className="imgs-slider-close-btn"
					type="button"
					onClick={onClose}
					aria-label="Close modal"
				>
					X
				</button>

				<button
					className="imgs-slider-nav-btn imgs-slider-nav-btn-prev"
					type="button"
					onClick={goPrev}
					aria-label="Previous image"
				>
					{'<'}
				</button>

				<img
					className="imgs-slider-image"
					src={hdImages[currentIndex]}
					alt={`Screenshot ${currentIndex + 1}`}
				/>

				<button
					className="imgs-slider-nav-btn imgs-slider-nav-btn-next"
					type="button"
					onClick={goNext}
					aria-label="Next image"
				>
					{'>'}
				</button>
			</div>
		</div>
	)
}

export default ImageModalSlider
