export default function StepBar() {
  return (
    <div>
      <div className="stepbar__status">
        <div className="stepbar__track">
          <div className="tracker">
            <div className="tracker__single active">
              <span className="tracker__single__number">1</span>
            </div>
            <div className="tracker__single">
              <span className="tracker__single__number">2</span>
            </div>
            <div className="tracker__single">
              <span className="tracker__single__number">3</span>
            </div>
            <div className="tracker__single">
              <span className="tracker__single__number">4</span>
            </div>
          </div>
          <div className="stepbar__step active">
            <span className="stepbar__step-label active">Received</span>
          </div>
          <div className="stepbar__step active">
            <span className="stepbar__step-label active">Processing</span>
          </div>
          <div className="stepbar__step">
            <span className="stepbar__step-label">Shipped</span>
          </div>
          <div className="stepbar__step">
            <span className="stepbar__step-label">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
