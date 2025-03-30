export function createVideoJson(
  voiceJson: { text: string; time: number }[],
  urls: {
    url: string;
    promptIndex: number;
  }[]
) {
  const combinedData = urls.map((url) => {
    const voiceEntry = voiceJson[url.promptIndex];

    return {
      url: url.url,
      prompt: url.promptIndex,
      text: voiceEntry ? voiceEntry.text : "",
      time: voiceEntry ? voiceEntry.time : 0,
    };
  });

  const textClips = combinedData.map((item, index) => {
    const previousItems = combinedData.slice(0, index);
    const start = previousItems.reduce((sum, prev) => sum + prev.time, 0);

    return {
      asset: {
        type: "text",
        text: item.text,
        font: {
          family: "Arial",
          size: 40,
          color: "#ffffff",
        },
        alignment: {
          vertical: "bottom",
          horizontal: "center",
        },
      },
      start: start,
      length: item.time,
    };
  });

  const imageClips = combinedData.map((item, index) => {
    const previousItems = combinedData.slice(0, index);
    const start = previousItems.reduce((sum, prev) => sum + prev.time, 0);

    const effects = [
      "zoomIn",
      "zoomOut",
      "slideRight",
      "slideLeft",
      "slideUp",
      "slideDown",
    ];
    const transitions = [
      "slideLeft",
      "slideUp",
      "fade",
      "slideDown",
      "slideRight",
    ];

    const effect = effects[index % effects.length];
    const transition = transitions[index % transitions.length];

    return {
      asset: {
        type: "image",
        src: item.url,
      },
      start: start,
      length: item.time,
      effect: effect,
      transition: index > 0 ? { in: transition } : undefined,
    };
  });

  const videoJson = {
    timeline: {
      background: "#000000",
      tracks: [
        {
          clips: textClips,
        },
        {
          clips: imageClips,
        },
      ],
    },
    output: {
      format: "mp4",
      size: {
        width: 720,
        height: 1280,
      },
      fps: 30,
    },
  };

  return videoJson;
}
