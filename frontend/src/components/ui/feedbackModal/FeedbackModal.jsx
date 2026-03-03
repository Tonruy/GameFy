import './feedbackModal.css';

export default function FeedbackModal({ isOpen, message, type = 'success', onClose }) {
	if (!isOpen || !message) {
		return null;
	}

	return (
		<div className={`feedback-modal feedback-modal--${type}`} role="status" aria-live="polite" onClick={onClose}>
			<p className="feedback-modal__text">{message}</p>
		</div>
	);
}
