import React from 'react';
import { Phone, Mail, MessageSquare, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const ClientAgent = () => {
  const { user, getAgentById } = useAuthStore();
  const agent = getAgentById(user?.agentId);

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <User className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">Agent Not Found</h3>
          <p className="text-sm text-brand-text">
            Your agent information is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Agent Profile */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-3 rounded-full gold-gradient flex items-center justify-center">
          {agent.profilePhoto ? (
            <img src={agent.profilePhoto} alt={agent.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-brand-dark" />
          )}
        </div>
        <h2 className="font-display text-2xl font-semibold text-white">{agent.name}</h2>
        <p className="text-sm text-brand-gold">{agent.title}</p>
      </div>

      {/* About Section */}
      <div className="rounded-xl p-4 bg-brand-gray border border-brand-border">
        <h3 className="font-display text-base font-semibold text-white mb-2">About Me</h3>
        <p className="text-xs leading-relaxed text-brand-text-light">
          {agent.bio || 'Dedicated to providing exceptional service and finding the perfect home for my clients.'}
        </p>
      </div>

      {/* Contact Options */}
      <div className="space-y-3">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center gap-3 rounded-lg p-3 bg-brand-gray border border-brand-border touch-feedback"
        >
          <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Call Me</p>
            <p className="text-sm font-medium text-white">{agent.phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-3 rounded-lg p-3 bg-brand-gray border border-brand-border touch-feedback"
        >
          <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Email Me</p>
            <p className="text-sm font-medium text-white">{agent.email}</p>
          </div>
        </a>

        <a
          href={`sms:${agent.phone}`}
          className="flex items-center gap-3 rounded-lg p-3 bg-brand-gray border border-brand-border touch-feedback"
        >
          <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Text Me</p>
            <p className="text-sm font-medium text-white">Send a message</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ClientAgent;
