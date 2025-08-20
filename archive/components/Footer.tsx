import React from 'react';
import { MessageCircle, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center gap-1">
            © 2025 AI Twin Tech. All rights reserved. - Built with <Heart className="w-4 h-4 text-red-500" /> by SketchApp.
          </p>
          <div className="flex items-center">
            <a
              href="#"
              className="flex items-center gap-2 text-white font-semibold hover:text-electric-blue-400 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Let's Chat (Introvert Friendly)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
