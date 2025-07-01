import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from "react-icons/fa";

interface SocialSharingProps {
  shareUrl: string;
  title: string;
  description: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ shareUrl, title, description }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="medium-share">
      <h3 className="medium-section-title">Share this article</h3>
      <div className="medium-share-buttons">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="medium-share-button medium-facebook"
          aria-label="Share on Facebook"
        >
          <FaFacebook size={20} />
          <span className="medium-share-label">Share</span>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="medium-share-button medium-twitter"
          aria-label="Share on Twitter"
        >
          <FaTwitter size={20} />
          <span className="medium-share-label">Tweet</span>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="medium-share-button medium-linkedin"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin size={20} />
          <span className="medium-share-label">Post</span>
        </a>
        <button
          onClick={handleCopyLink}
          className="medium-share-button medium-copy"
          aria-label="Copy link"
        >
          <FaCopy size={20} />
          <span className="medium-share-label">{copied ? "Copied!" : "Copy link"}</span>
        </button>
      </div>
    </div>
  );
};

export default SocialSharing;
