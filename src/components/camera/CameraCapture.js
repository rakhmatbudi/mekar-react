import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const CameraCapture = ({ onPhotoCapture, capturedPhoto, onRemovePhoto }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use a different device.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onPhotoCapture(photoDataUrl);
    stopCamera();
  };

  if (!capturedPhoto && !isCapturing) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Take a photo of your plant</p>
        <button
          type="button"
          onClick={startCamera}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Camera className="w-4 h-4" />
          Open Camera
        </button>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            id="camera-video"
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;
                video.play();
              }
            }}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
          />
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={capturePhoto}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
            Capture Photo
          </button>
          <button
            type="button"
            onClick={stopCamera}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={capturedPhoto}
          alt="Plant preview"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={startCamera}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Camera className="w-4 h-4" />
          Retake Photo
        </button>
        <button
          type="button"
          onClick={onRemovePhoto}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Remove Photo
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;