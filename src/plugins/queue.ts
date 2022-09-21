import appStore from '@/store/modules/appStore';
import {SnackbarItem} from '@/typings'
export default class ToastQueue {
    delay= 1300;
    
    currentTimer: number | null = null;

    alerts: {alert: SnackbarItem, delay: number}[] = [];

    add(alert: SnackbarItem) {
        alert.color = alert.color || 'info';
        this.alerts.push({alert: alert, delay: !this.currentTimer ? 0 : this.delay});

        // If there's a scheduled task, ball out.
        if(this.currentTimer) return;

        // Otherwise, start kicking tires
        this.launchNext();
    }

    launchNext() {
        if(this.currentTimer) return;

        const self = this;
        const nextAlert = this.alerts.shift();

        if(!nextAlert) return this.clear();

        appStore.SET_SNACKBAR(nextAlert.alert);
        this.currentTimer = window.setTimeout(function() {
            self.currentTimer = null;

            // Call this function again to set up the next task
            self.launchNext();
        }, this.delay+50);
    }

    clear(): void {
        if(this.currentTimer) clearTimeout(this.currentTimer);

        // Timer clears only destroy the timer. It doesn't null references.
        this.currentTimer = null;

         // Fast way to clear the task queue
        this.alerts.length = 0;
    }
}