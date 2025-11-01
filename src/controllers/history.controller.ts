import {reactive, ref} from 'vue';
import {ExtendedNodes} from '@/types/extendedNode';
import {ExtendedEdges} from '@/types/extendedEdge';
import * as vNG from 'v-network-graph';
import {BackgroundImage} from '@/types/visualizationLayout';

interface HistoryState {
  nodes: ExtendedNodes;
  edges: ExtendedEdges;
  layouts: vNG.Layouts;
  backgroundImage: BackgroundImage;
}

export class HistoryController {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;
  public canUndo = ref<boolean>(false);
  public canRedo = ref<boolean>(false);

  /**
   * Take a snapshot of the current state
   */
  takeSnapshot(
    nodes: ExtendedNodes,
    edges: ExtendedEdges,
    layouts: vNG.Layouts,
    backgroundImage: BackgroundImage,
  ): void {
    // Deep clone the state
    const snapshot: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      layouts: JSON.parse(JSON.stringify(layouts)),
      backgroundImage: JSON.parse(JSON.stringify(backgroundImage)),
    };

    // If we're in the middle of history (after undo), remove future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new snapshot
    this.history.push(snapshot);

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.updateCanUndoRedo();
  }

  /**
   * Get the previous state (undo)
   */
  undo(): HistoryState | null {
    if (!this.canUndo.value) {
      return null;
    }

    this.currentIndex--;
    this.updateCanUndoRedo();
    return this.getCurrentState();
  }

  /**
   * Get the next state (redo)
   */
  redo(): HistoryState | null {
    if (!this.canRedo.value) {
      return null;
    }

    this.currentIndex++;
    this.updateCanUndoRedo();
    return this.getCurrentState();
  }

  /**
   * Get the current state in history
   */
  getCurrentState(): HistoryState | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return null;
    }
    return this.history[this.currentIndex];
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.updateCanUndoRedo();
  }

  /**
   * Update canUndo and canRedo flags
   */
  private updateCanUndoRedo(): void {
    this.canUndo.value = this.currentIndex > 0;
    this.canRedo.value = this.currentIndex < this.history.length - 1;
  }
}
