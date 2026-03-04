import spinnerGif from "../../../assets/spinner.gif"


const Spinner = () => {

	return (
		<div className="spinner-container">
			<img src={spinnerGif} alt="Loading content" />
		</div>
	)
}

export default Spinner
