'use client';

import React, { useEffect, useRef } from 'react';
// import * as shaka from 'shaka-player/dist/shaka-player.compiled';
// eslint-disable-next-line: no typescript support
import shaka from 'shaka-player/dist/shaka-player.compiled';

// Install Shaka Player polyfills once when the module is loaded.
// This is more efficient than doing it on every component mount.
// shaka.polyfill.installAll();

interface ShakaPlayerProps {
  src: string;
}

/**
 * A React component that wraps the Shaka Player library to play audio streams.
 * It handles the player's lifecycle, including initialization, playback, and cleanup.
 *
 * @param {ShakaPlayerProps} props - The component's props.
 * @returns {JSX.Element} A hidden audio element controlled by Shaka Player.
 */
const ShakaPlayer: React.FC<ShakaPlayerProps> = ({ src }) => {
  // Create refs to hold the audio element and the Shaka Player instance.
  // The type for the playerRef now uses the globally declared 'shaka' object.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  // The main useEffect hook to manage the Shaka Player lifecycle.
  // It runs when the component mounts and whenever the `src` prop changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // --- CLEANER SOLUTION: Use AbortController for robust async cleanup ---
    const abortController = new AbortController();
    const signal = abortController.signal;

    // This async function initializes the player.
    const setupPlayer = async () => {
      // Clean up any player instance from a previous render.
      if (playerRef.current) {
        await playerRef.current.destroy();
        playerRef.current = null;
      }
      // If the effect was cleaned up, stop here.
      if (signal.aborted) return;

      if (!shaka.Player.isBrowserSupported()) {
        return console.error('Shaka Player is not supported by this browser.');
      }

      const player = new shaka.Player();
      playerRef.current = player;

      player.configure({
        drm: { servers: {} },
        manifest: { defaultPresentationDelay: 0 },
      });

      player.addEventListener('error', () => console.error('Shaka Player Error:'));

      try {
        await player.attach(audio);
        if (signal.aborted) return;

        console.log(`Shaka Player attached. Loading source: ${src}`);
        await player.load(src);
        if (signal.aborted) return;

        audio.play();
        console.log('Playback started.');
      } catch (error) {
        console.error('Error setting up Shaka Player:', error);
      }
    };

    setupPlayer();

    // The cleanup function for this effect.
    return () => {
      // Abort any ongoing async operations.
      abortController.abort();

      const player = playerRef.current;

      if (!player) return;

      console.log('Cleaning up: Destroying Shaka Player instance.');
      player.destroy();
      playerRef.current = null;
    };
  }, [src]); // The effect's dependency array includes `src` to re-initialize on URL change.

  // Render the hidden audio element that Shaka Player will control.
  return <audio ref={audioRef} style={{ width: 0, height: 0 }} />;
};

export default ShakaPlayer;
