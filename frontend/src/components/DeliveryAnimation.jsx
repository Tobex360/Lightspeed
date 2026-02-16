import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography

const DeliveryAnimation = ({ status }) => {
  const getAnimationState = () => {
    switch(status) {
      case 'pending':
        return { progress: 5, message: 'Assigning a Delivery Partner...', theme: '#f39c12' };
      case 'accepted':
        return { progress: 25, message: 'Driver is heading to pickup!', theme: '#3498db' };
      case 'in-transit':
        return { progress: 65, message: 'On the way to your destination!', theme: '#2ecc71' };
      case 'completed':
        return { progress: 100, message: 'Success! Package Delivered.', theme: '#1abc9c' };
      default:
        return { progress: 0, message: 'Initializing...', theme: '#9b59b6' };
    }
  };

  const { progress, message, theme } = getAnimationState();
  const isCompleted = status === 'completed';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
      borderRadius: '24px',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '340px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Dynamic Clouds */}
      <div className="cloud" style={{ top: '15%', left: '10%', fontSize: '30px' }}>☁️</div>
      <div className="cloud" style={{ top: '25%', left: '80%', fontSize: '24px', animationDelay: '2s' }}>☁️</div>
      
      {/* Status Message Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: '8px 24px',
          borderRadius: '50px',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <span style={{ 
             display: 'inline-block', 
             width: '10px', 
             height: '10px', 
             borderRadius: '50%', 
             background: theme,
             marginRight: '10px',
             boxShadow: `0 0 10px ${theme}`
          }} />
          {message}
        </div>
      </div>

      {/* The Road Surface */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '-5%',
        right: '-5%',
        height: '40px',
        background: '#2c3e50',
        transform: 'perspective(500px) rotateX(20deg)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Road lines - stop animation when completed */}
        <div className={isCompleted ? "road-lines-stopped" : "road-lines"} />
      </div>

      {/* Pickup Marker */}
      <div style={{ position: 'absolute', bottom: '140px', left: '10%', textAlign: 'center' }}>
        <div style={{ fontSize: '50px', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }}>🏠</div>
        <div style={labelStyle}>Origin</div>
      </div>

      {/* Destination Marker */}
        <div
            style={{
                position: 'absolute',
                bottom: '140px',
                right: '10%',
                textAlign: 'center'
            }}
            >
            {isCompleted && (
                <div
                style={{
                    fontSize: '40px',
                    marginBottom: '8px',
                    animation: 'celebrationBounce 0.6s ease-in-out 3'
                }}
                >
                🎉
                </div>
            )}

            <div
                style={{
                fontSize: '50px',
                filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))'
                }}
            >
                📍
         </div>

    <div style={labelStyle}>Destination</div>
    </div>


      {/* Delivery Vehicle Group */}
      <div style={{
        position: 'absolute',
        bottom: '125px',
        left: `${progress}%`,
        transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translateX(-50%) scaleX(-1)`,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Package floating above vehicle - smaller and hidden when completed */}
        {!isCompleted && (
          <div className="package-bounce" style={{ fontSize: '28px', transform: 'scaleX(-1)', marginBottom: '5px' }}>📦</div>
        )}
        
        {/* Vehicle */}
        {!isCompleted && (
        <div
            style={{
            fontSize: '70px',
            animation: 'driveBounce 0.4s ease-in-out infinite'
            }}
        >
            🚚
        </div>
        )}

        
        {/* Speed lines effect - only show when in transit */}
        {status === 'in-transit' && (
          <div className="speed-lines" style={{ right: '-25px', left: 'auto' }}/>
        )}
      </div>

      {/* Sleek Progress Bar Container */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '10%',
        right: '10%',
        textAlign: 'center'
      }}>
        <div style={{
          height: '6px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, #fff, ${theme})`,
            transition: 'width 1.5s ease-in-out',
            boxShadow: `0 0 15px ${theme}`
          }} />
        </div>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '1px' }}>
          TRACKING: {progress}% DISPATCHED
        </Text>
      </div>

      <style>{`
        .cloud { position: absolute; opacity: 0.3; animation: cloudMove 20s linear infinite; pointer-events: none; }
        @keyframes cloudMove { from { transform: translateX(-100px); } to { transform: translateX(500px); } }
        
        .road-lines {
          position: absolute; top: 50%; left: 0; right: 0; height: 2px;
          background: repeating-linear-gradient(90deg, #fff 0, #fff 40px, transparent 40px, transparent 80px);
          transform: translateY(-50%);
          animation: roadScroll 0.8s linear infinite;
        }

        .road-lines-stopped {
          position: absolute; top: 50%; left: 0; right: 0; height: 2px;
          background: repeating-linear-gradient(90deg, #fff 0, #fff 40px, transparent 40px, transparent 80px);
          transform: translateY(-50%);
          animation: none;
        }

        @keyframes roadScroll { from { background-position: 160px 0; } to { background-position: 0 0; } }

        @keyframes driveBounce {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }

        @keyframes celebrationBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .package-bounce { animation: pkgFloat 2s ease-in-out infinite; }
        @keyframes pkgFloat { 0%, 100% { transform: translateY(0) scaleX(-1); } 50% { transform: translateY(-15px) scaleX(-1); } }

        .speed-lines {
            position: absolute; 
            top: 70%; 
            width: 20px; 
            height: 3px;
            background: rgba(255,255,255,0.6);
            box-shadow: 0 8px 0 rgba(255,255,255,0.4), 0 -8px 0 rgba(255,255,255,0.4);
            animation: fastLines 0.15s linear infinite;
        }

        @keyframes fastLines { 
            from { 
                opacity: 1; 
                transform: translateX(0); 
            } 
            to { 
                opacity: 0; 
                transform: translateX(35px); 
            } 
        }
      `}</style>
    </div>
  );
};

const labelStyle = {
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(5px)',
  padding: '2px 10px',
  borderRadius: '8px',
  fontSize: '10px',
  color: 'white',
  marginTop: '5px',
  border: '1px solid rgba(255,255,255,0.1)',
  textTransform: 'uppercase'
};

export default DeliveryAnimation;