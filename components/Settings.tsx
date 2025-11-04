import React, { useState, useRef } from 'react';
import type { Profile } from '../types';

// Define Crop type locally as we can't import from 'react-image-crop'
interface Crop {
  unit: 'px' | '%';
  x: number;
  y: number;
  width: number;
  height: number;
}

// Helper to get the cropped image data URL
function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<string> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // We want a high-resolution canvas to get a sharp image
    const pixelRatio = window.devicePixelRatio || 1;
    
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Canvas context is not available'));
    }
    
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;
    const destX = 0;
    const destY = 0;
    const destWidth = crop.width * scaleX;
    const destHeight = crop.height * scaleY;

    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
    );

    return new Promise((resolve) => {
        resolve(canvas.toDataURL('image/jpeg'));
    });
}


interface SettingsProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [localProfile, setLocalProfile] = useState<Profile>(profile);
  const [profileSaved, setProfileSaved] = useState(false);
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({type: '', text: ''});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States and refs for image cropping
  const [imageSrcForCrop, setImageSrcForCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const ReactCrop = (window as any).ReactCrop?.default ?? (window as any).ReactCrop;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCrop(undefined); // Reset crop when new image is selected
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImageSrcForCrop(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleCropSave = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
        try {
            const croppedImageUrl = await getCroppedImg(
                imgRef.current,
                completedCrop
            );
            setLocalProfile(prev => ({ ...prev, avatarUrl: croppedImageUrl }));
            setImageSrcForCrop(null); // Close modal
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    }
  };

  const handleProfileSave = () => {
    setProfile(localProfile); // Update global state
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    setPasswordMessage({type: '', text: ''});
    if (!passwords.newPassword || !passwords.currentPassword) {
        setPasswordMessage({type: 'error', text: 'Please fill all password fields.'});
        return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordMessage({type: 'error', text: 'New passwords do not match.'});
        return;
    }
    // In a real app, you would verify the current password and then update it.
    console.log('Password updated.');
    setPasswordMessage({type: 'success', text: 'Password updated successfully!'});
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordMessage({type: '', text: ''}), 3000);
  };


  return (
    <div className="space-y-8">
        {imageSrcForCrop && ReactCrop && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="crop-dialog-title">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
                    <h3 id="crop-dialog-title" className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Crop Your New Avatar</h3>
                    <div className="flex justify-center">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            minWidth={100}
                            circularCrop={true}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imageSrcForCrop}
                                style={{ maxHeight: '70vh', userSelect: 'none' }}
                                aria-label="Image to be cropped"
                            />
                        </ReactCrop>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={() => setImageSrcForCrop(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="button" onClick={handleCropSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Save Crop</button>
                    </div>
                </div>
            </div>
        )}

      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Profile & Settings</h2>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex flex-col items-center">
                <img
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-blue-500/50"
                    src={localProfile.avatarUrl}
                    alt="User avatar"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Upload new picture
                </button>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={localProfile.name}
                        onChange={handleProfileChange}
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={localProfile.title}
                        onChange={handleProfileChange}
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={localProfile.email}
                        onChange={handleProfileChange}
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={localProfile.phone}
                        onChange={handleProfileChange}
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end items-center gap-4">
            {profileSaved && <span className="text-sm text-green-600 dark:text-green-400">Profile updated successfully!</span>}
            <button onClick={handleProfileSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Save Changes
            </button>
        </div>
      </div>

      {/* Password Management */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
        </div>
         <div className="mt-6 flex justify-end items-center gap-4">
            {passwordMessage.text && (
                 <span className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {passwordMessage.text}
                 </span>
            )}
            <button onClick={handleUpdatePassword} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Update Password
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;