import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from "react-icons/fa";

interface SocialSharingProps {
  shareUrl: string;
  title: string;
  description: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ shareUrl, title, description }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl text-green-400 mb-4 font-mono">Share this deployment:</h3>
      <div className="flex space-x-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
        >
          <FaFacebook size={32} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
        >
          <FaTwitter size={32} />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}&summary=${description}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FaLinkedin size={32} />
        </a>
        <button
          onClick={handleCopyLink}
          className="text-green-500 hover:text-green-600 transition-colors duration-200"
        >
          <FaCopy size={32} />
        </button>
      </div>
    </div>
  );
};

export default SocialSharing;
