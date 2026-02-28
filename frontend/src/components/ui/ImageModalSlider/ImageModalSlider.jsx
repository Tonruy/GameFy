import { useCallback, useEffect, useState } from 'react'
import "./ImageModalSlider.css";

const ImageModalSlider = ({ isOpen, images, initialIndex, onClose }) => {

	const [currentIndex, setCurrentIndex] = useState(null);
	const hdImages = Array.isArray(images) ? images.filter(Boolean) : [];
	const hdImagesLength = hdImages.length;

	useEffect(() => {
		if (!isOpen) { // Evade secondary effects if it doesn't change
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

	// Handlers next and back (setState for index+/- 1)
	// useCallback = save in memory for not render new functions with every render
	// useCallback ( () => function())
	const goNext = useCallback(() => {
		setCurrentIndex((prev) => {
			// If index is null (first render), start in first image
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

	// Key binding for ESC and arrows (cool)
	// event.key => events for keyboard
	// window.event is deprecated.
	// window.add/removeListener => necessary
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (e) => {
			// Use the callback event object instead of deprecated window.event
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

	// document.(element).style.overflow => controls the scroll of the client when modal is open
	// hidden : Content outside the element box is not shown
	// auto : Content is clipped and scroll bars are added when necessary
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

	// Checks before render
	if (!isOpen) { // Evade to render
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
				onClick={(e) => e.stopPropagation()} // Stops an event from bubbling up or capturing down the DOM tree 
				role="dialog"
				aria-modal="true" // When de modal is open the client is blocked but the modal opened
				aria-label="Image slider modal" // Accesibility -> names an element when text showed is not enaugh for understanding what it does
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
					‹
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
					›
				</button>
			</div>
		</div>
	)
}

export default ImageModalSlider
