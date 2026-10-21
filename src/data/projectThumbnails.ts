/**
 * Restrained placeholder visuals for project cards, keyed by slug.
 * Replace an entry with a real screenshot path when one exists.
 */
import restaurantOps from "@/assets/projects/restaurant-ops.jpg";
import resumeMl from "@/assets/projects/resume-ml.jpg";
import realtimeCollab from "@/assets/projects/realtime-collab.jpg";
import androidLauncher from "@/assets/projects/android-launcher.jpg";

export const projectThumbnails: Record<string, string> = {
  "restaurant-operations-dashboard": restaurantOps,
  "resume-classification-machine-learning": resumeMl,
  "real-time-collaborative-coding": realtimeCollab,
  "android-launcher-experiments": androidLauncher,
};
