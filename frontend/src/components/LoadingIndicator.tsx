import "../styles/LoadingIndicator.css"

const LoadingIndicator = () => {
    return <div data-testid="loader" className="loading-container">
        <div className="loader"></div>
    </div>
}

export default LoadingIndicator