import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Time In', icon: '📍' },
    { id: 2, label: 'Time Out', icon: '⏰' },
    { id: 3, label: 'Survey', icon: '📝' },
    { id: 4, label: 'Certificate', icon: '🎓' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.progressBar}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={styles.stepContainer}>
              <div style={{
                ...styles.step,
                ...(currentStep >= step.id ? styles.stepActive : {}),
                ...(currentStep === step.id ? styles.stepCurrent : {})
              }}>
                <span style={styles.stepIcon}>{step.icon}</span>
              </div>
              <div style={{
                ...styles.stepLabel,
                ...(currentStep >= step.id ? styles.labelActive : {})
              }}>
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div style={styles.lineContainer}>
                <div style={{
                  ...styles.line,
                  ...(currentStep > step.id ? styles.lineActive : {})
                }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 0 auto'
  },
  step: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#e8e8e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.3s ease',
    marginBottom: '8px'
  },
  stepActive: {
    backgroundColor: '#c8102e',
    transform: 'scale(1.1)'
  },
  stepCurrent: {
    boxShadow: '0 0 0 4px rgba(200,16,46,0.2)',
    animation: 'pulse 2s infinite'
  },
  stepIcon: {
    filter: 'grayscale(100%)'
  },
  stepLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
    textAlign: 'center'
  },
  labelActive: {
    color: '#c8102e',
    fontWeight: '600'
  },
  lineContainer: {
    flex: 1,
    padding: '0 10px',
    marginBottom: '30px'
  },
  line: {
    height: '3px',
    backgroundColor: '#e8e8e8',
    transition: 'all 0.3s ease'
  },
  lineActive: {
    backgroundColor: '#c8102e'
  }
};

export default ProgressBar;
