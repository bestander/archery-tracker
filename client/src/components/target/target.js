import React from "react";

const styles = {
  targetContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center"
  },
  zoomContainer: {
    touchAction: "none",
    overflow: "hidden",
    display: "flex"
  },
  panContainer: {
    display: "flex",
    justifyContent: "center"
  },
  targetRing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: "1px solid black"
  }
};

export default class Target extends React.Component {
  constructor(props) {
    super(props);
    this.setCanvasRef = element => {
      this.canvas = element;
    };
  }

  componentDidMount() {
    this.initTarget();
  }

  componentDidUpdate() {
    // this.context = this.canvas.getContext("2d");
    // this.doCanvas();
  }

  ZOOM = 2;

  render() {
    const outerRingMaxRadius = this.targetScoreRange[
      this.targetScoreRange.length - 1
    ].maxRadius;
    let outerRing;
    this.targetScoreRange.forEach(score => {
      outerRing = (
        <div
          style={{
            height: `${score.maxRadius * this.ZOOM}px`,
            width: `${score.maxRadius * this.ZOOM}px`,
            backgroundColor: score.color,
            ...styles.targetRing
          }}
          onMouseUp={event => {
            event.stopPropagation();
            const pos = this.getMousePos(this.targetPanWrapper, event);
            const shot = { x: pos.x / this.ZOOM, y: pos.y / this.ZOOM };
            console.log("shoot", score.points, shot);
          }}
          onTouchMove={event => {
            // console.log("TOCUH MOVE", score.points)
          }}
          onTouchEnd={event => {
            // console.log(event.target)
          }}
        >
          {outerRing}
        </div>
      );
    });

    return (
      <div style={styles.targetContainer}>
        <div
          style={styles.zoomContainer}
          ref={elem => {
            this.targetZoomWrapper = elem;
          }}
          onMouseMove={event => {
            const pos = this.getMousePos(this.targetZoomWrapper, event);
            const adjustedX = (outerRingMaxRadius - pos.x) / 1.5;
            const adjustedY = (outerRingMaxRadius - pos.y) / 1.5;
            this.targetPanWrapper.style.transform = `scale(${
              this.ZOOM
            }) translateX(${adjustedX}px) translateY(${adjustedY}px)`;
          }}
          onMouseLeave={event => {
            this.targetPanWrapper.style.transform = "scale(1)";
          }}
          onTouchMove={event => {
            // this is to prevent scrolling on iOS
            // event.preventDefault();
            // Ignore multi touch events
            if (event.touches.length > 1) {
              return;
            }
            // this.touchMove = true;
            var pos = this.getTouchPos(this.targetZoomWrapper, event);
            const adjustedX = (outerRingMaxRadius - pos.x) / 1.5;
            const adjustedY = (outerRingMaxRadius - pos.y) / 1.5;
            this.targetPanWrapper.style.transform = `scale(${
              this.ZOOM
            }) translateX(${adjustedX}px) translateY(${adjustedY}px)`;
          }}
          onTouchEnd={event => {
            event.stopPropagation();
            var touches = event.changedTouches;
            // const pos = this.getTouchPos(this.targetZoomWrapper, event);
            // const shot = { x: pos.x / this.ZOOM, y: pos.y / this.ZOOM };
            console.log("shoot", touches);
          }}
        >
          <div
            style={styles.panContainer}
            ref={elem => {
              this.targetPanWrapper = elem;
            }}
          >
            {outerRing}
          </div>
        </div>
      </div>
    );
  }

  centerPoint = { x: 150, y: 150 };
  touchCursorOffset = 100;
  targetScoreRange = [
    {
      color: "#ffc107",
      minRadius: 0,
      maxRadius: 15,
      invert: false,
      points: 10
    },
    {
      color: "#ffc107",
      minRadius: 16,
      maxRadius: 30,
      invert: false,
      points: 9
    },
    {
      color: "#dc3545",
      minRadius: 31,
      maxRadius: 45,
      invert: false,
      points: 8
    },
    {
      color: "#dc3545",
      minRadius: 46,
      maxRadius: 60,
      invert: false,
      points: 7
    },
    {
      color: "#17a2b8",
      minRadius: 61,
      maxRadius: 75,
      invert: false,
      points: 6
    },
    {
      color: "#17a2b8",
      minRadius: 76,
      maxRadius: 90,
      invert: false,
      points: 5
    },
    {
      color: "black",
      minRadius: 91,
      maxRadius: 105,
      invert: true,
      points: 4
    },
    {
      color: "black",
      minRadius: 106,
      maxRadius: 120,
      invert: true,
      points: 3
    },
    {
      color: "white",
      minRadius: 121,
      maxRadius: 135,
      invert: false,
      points: 2
    },
    {
      color: "white",
      minRadius: 136,
      maxRadius: 150,
      invert: false,
      points: 1
    }
  ];
  cursorPos = {};
  context = {};
  zoom = 0.5;
  zoomFactor;
  iw;
  ih;
  base_image;
  touchMove = false;

  initTarget() {
    // this.context = this.canvas.getContext("2d");
    this.makeBase();
  }

  calculateScore(position) {
    let distanceFromCenter = Math.trunc(
      Math.sqrt(
        Math.pow(this.centerPoint.x - position.x, 2) +
          Math.pow(this.centerPoint.y - position.y, 2)
      )
    );

    let score = this.targetScoreRange.find(
      item =>
        distanceFromCenter <= item.maxRadius &&
        distanceFromCenter >= item.minRadius
    );

    return score
      ? { score: score.points, isInverted: score.invert }
      : { score: 0, isInverted: false };
  }

  drawDot(position, fill) {
    this.context.fillStyle = fill;
    this.context.beginPath();
    this.context.arc(position.x, position.y, 2, 0, 2 * Math.PI);
    this.context.fill();
  }

  handleMouseUp(e) {
    // const pos = this.getMousePos(this.canvas, e);
    // const newArrow = this.generatePointOnTarget(pos, false);
    // this.props.createArrow(newArrow);
  }

  handleTouchEnd(event) {
    event.preventDefault();
    if (!this.touchMove) return;
    this.touchMove = false;
    const newArrow = this.generatePointOnTarget(this.cursorPos, true);
    this.props.createArrow(newArrow);
  }

  generatePointOnTarget(zoomedCoordinates, isTouch) {
    const normalCoordinates = isTouch
      ? {
          x: (zoomedCoordinates.x - zoomedCoordinates.x * this.zoom) * 2,
          y:
            (zoomedCoordinates.y - 25 - zoomedCoordinates.y * this.zoom + 25) *
            2
        }
      : {
          x: (zoomedCoordinates.x - zoomedCoordinates.x * this.zoom) * 2,
          y: (zoomedCoordinates.y - zoomedCoordinates.y * this.zoom) * 2
        };

    const score = this.calculateScore(normalCoordinates);
    return {
      point: normalCoordinates,
      isInverted: score.isInverted,
      score: score.score
    };
  }

  // re-draw target with all entered points
  doCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(
      this.base_image,
      0,
      0,
      this.iw * this.zoom,
      this.ih * this.zoom
    );

    this.props.arrows.forEach(arrow =>
      this.drawDot(arrow.coordinates, arrow.isInverted ? "#FFFFFF" : "#000000")
    );
  }

  // show zoomed canvas on desktop
  handleMouseMove(e) {
    var pos = this.getMousePos(this.canvas, e);
    this.handleZoom(pos);
  }

  // get position of mouse cursor
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // show zoomed canvas on mobile
  handleTouchMove(e) {
    // this is to prevent scrolling on iOS
    e.preventDefault();
    // Ignore multi touch events
    if (e.touches.length > 1) {
      return;
    }
    this.touchMove = true;
    var pos = this.getTouchPos(this.canvas, e);
    this.handleZoom(pos, true);
  }

  // get position for touch event
  getTouchPos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  }

  // display zoomed target
  handleZoom(pos, isTouch) {
    var x = pos.x;
    var y = pos.y;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const y1 = isTouch
      ? -y * this.zoomFactor + this.touchCursorOffset
      : -y * this.zoomFactor;
    this.context.drawImage(
      this.base_image,
      -x * this.zoomFactor,
      y1,
      this.iw,
      this.ih
    );
    if (isTouch) {
      // draw cursor for touch
      this.cursorPos = { x, y: y - this.touchCursorOffset };
      this.drawDot(this.cursorPos, "#39ff14");
    }

    this.props.arrows.forEach(arrow => {
      const newX = -x * this.zoomFactor + arrow.coordinates.x * 2;
      const newY = -y * this.zoomFactor + arrow.coordinates.y * 2;
      this.drawDot(
        { x: newX, y: isTouch ? newY + this.touchCursorOffset : newY },
        arrow.isInverted ? "#FFFFFF" : "#000000"
      );
    });
  }

  makeBase() {
    // this.base_image = new Image();
    // this.base_image.src = target;
    // this.base_image.onload = () => {
    //   this.iw = 600;
    //   this.ih = 600;
    //   this.canvas.width = this.iw * this.zoom;
    //   this.canvas.height = this.ih * this.zoom;
    //   this.zoomFactor = (600 - 600 * this.zoom) / this.canvas.width;
    //   this.doCanvas();
    //
    //   //redraw canvas at default zoom
    //   this.canvas.addEventListener(
    //     "mouseout",
    //     () => {
    //       this.doCanvas();
    //     },
    //     false
    //   );
    //   // show zoomed canvas
    //   this.canvas.addEventListener(
    //     "mousemove",
    //     event => {
    //       this.handleMouseMove(event);
    //     },
    //     false
    //   );
    //   // draw dot
    //   this.canvas.addEventListener(
    //     "mouseup",
    //     event => {
    //       this.handleMouseUp(event);
    //     },
    //     false
    //   );
    //   //show zoomed canvas mobile
    //
    //   this.canvas.addEventListener(
    //     "touchmove",
    //     throttle(event => {
    //       this.handleTouchMove(event);
    //     }, 16),
    //
    //     true
    //   );
    //   // draw dot
    //
    //   this.canvas.addEventListener(
    //     "touchend",
    //     event => {
    //       this.handleTouchEnd(event);
    //     },
    //     false
    //   );
    // };
  }
}

function throttle(cb, delay) {
  var timesUp = true;
  return function(event) {
    if (!timesUp) return;
    setTimeout(function() {
      timesUp = true;
    }, delay);

    timesUp = false;
    cb(event);
  };
}
