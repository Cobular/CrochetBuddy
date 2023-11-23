export class SwipeHandler {
  private startX: number;
  private startY: number;
  private threshold: number;

  private swipeLeftHandlers: (() => void)[] = [];
  private swipeRightHandlers: (() => void)[] = [];
  private swipeUpHandlers: (() => void)[] = [];
  private swipeDownHandlers: (() => void)[] = [];
  private pressHandlers: (() => void)[] = [];

  constructor(threshold?: number) {
    this.startX = 0;
    this.startY = 0;
    this.threshold = threshold ?? 100;
  }

  registerSwipeLeft(onSwipeLeft: () => void) {
    this.swipeLeftHandlers.push(onSwipeLeft);
  }

  registerSwipeRight(onSwipeRight: () => void) {
    this.swipeRightHandlers.push(onSwipeRight);
  }

  registerSwipeUp(onSwipeUp: () => void) {
    this.swipeUpHandlers.push(onSwipeUp);
  }

  registerSwipeDown(onSwipeDown: () => void) {
    this.swipeDownHandlers.push(onSwipeDown);
  }

  registerPress(onPress: () => void) {
    this.pressHandlers.push(onPress);
  }

  onTouchStart(event: TouchEvent) {
    console.log('touch start');
    
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const diffX = endX - this.startX;
    const diffY = endY - this.startY;

    console.log('touch end', diffX, diffY, this.threshold);

    if (Math.abs(diffX) < this.threshold && Math.abs(diffY) < this.threshold) {
      console.log('press');
      
      this.pressHandlers.forEach(handler => handler());
      return;
    } else if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 0) {
        console.log('swipe right');
        this.swipeRightHandlers.forEach(handler => handler());
      } else {
        console.log('swipe left');
        this.swipeLeftHandlers.forEach(handler => handler());
      }
    } else {      
      // Vertical swipe
      if (diffY > 0) {
        this.swipeDownHandlers.forEach(handler => handler());
      } else {
        this.swipeUpHandlers.forEach(handler => handler());
      }
    }
  }
}