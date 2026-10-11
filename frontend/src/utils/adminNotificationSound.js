let notificationAudio = null;

export const playAdminNotificationSound = () => {
  try {
    if (!notificationAudio) {
      notificationAudio =
        new Audio(
          "/notification.mp3"
        );

      notificationAudio.volume = 0.7;
    }

    notificationAudio.currentTime = 0;

    notificationAudio
      .play()
      .catch((error) => {
        console.log(
          "Notification sound could not play:",
          error
        );
      });
  } catch (error) {
    console.error(
      "Notification sound error:",
      error
    );
  }
};