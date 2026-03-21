"use client";

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils"
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if(message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript};
        setMessages((prev) => [...prev, newMessage]);
      }
    }
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.log('Vapi error', error);
      setCallStatus(CallStatus.INACTIVE);
      setError('Call failed: ' + (error?.message ?? 'unknown error'));
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, [])

  const handleGenerateFeedback = async (messages: SavedMessage[])=> {
    console.log("Generate feedback here.");
    const { success, id } = {
      success: true,
      id: "feedback-id"
    }
    //TODO: Create a server action that generates feedback
    if(success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log('Error saving feedback');
      router.push('/');
    }
  }

  useEffect(() => {
    if(callStatus === CallStatus.FINISHED) {
      if(type === 'generate') {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setError(null);
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError('Assistant ID is not configured. Check NEXT_PUBLIC_VAPI_ASSISTANT_ID in .env.local');
      return;
    }
    setCallStatus(CallStatus.CONNECTING);
    try {
      if(type === 'generate') {
        await vapi.start(assistantId, {
          variableValues: {
            username: userName || 'there',
            userid: userId || '',
          },
        });
      } else {
        let formattedQuestions = '';
        if(questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join('\n');
        }
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions
          }
        })
      }
    } catch (err: any) {
      console.error('vapi.start failed:', err);
      setCallStatus(CallStatus.INACTIVE);
      setError('Could not start call: ' + (err?.message ?? 'unknown error'));
    }
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveorFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  const getButtonText = () => {
    if (callStatus === CallStatus.CONNECTING) return ". . ."
    return "Call"
  }

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/suraj_left.jpeg"
              alt="user avatar"
              width={150}
              height={150}
              className="rounded-full object-cover size-{120px}"
            />
            <h3>{userName ?? 'You'}</h3>
          </div>
        </div>
      </div>
      {error && (
        <div className="transcript-border">
          <div className="transcript">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        </div>
      )}
      {!error && messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}/>
            <span>
              {isCallInactiveorFinished ? "Call" : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>End</button>
        )}
      </div>
    </>
  )
}

export default Agent
