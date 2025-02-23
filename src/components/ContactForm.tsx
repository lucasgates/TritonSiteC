import React, { useState } from 'react';

interface FormData {
  nome_do_contato: string;
  email: string;
  telefone: string;
  empresa: string;
  observa_es: string;
}

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nome_do_contato: '',
    email: '',
    telefone: '',
    empresa: '',
    observa_es: '',
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const validateEmail = (email: string) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'aol.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return !personalDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setFormState(prev => ({
        ...prev,
        error: 'Por favor, utilize seu email corporativo para contato.',
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const payload = new URLSearchParams({
        nome_do_contato: formData.nome_do_contato,
        email: formData.email,
        telefone: formData.telefone,
        empresa: formData.empresa,
        observa_es: formData.observa_es,
        url: window.location.href,
        referral: document.referrer || 'direct'
      });

      const response = await fetch('https://autumn-lab-6af2.lucas-5c3.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setFormState(prev => ({ ...prev, isSubmitted: true }));
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState(prev => ({
        ...prev,
        error: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
      }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  if (formState.isSubmitted) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-triton-dark mb-4">Obrigado pelo seu interesse!</h2>
        <p className="text-gray-600">
          Agradecemos o seu contato. Nossa equipe entrará em contato em breve para discutir como podemos ajudar sua empresa.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-triton-dark mb-6">Solicite um Orçamento</h2>
      
      <div>
        <label htmlFor="nome_do_contato" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="nome_do_contato"
          name="nome_do_contato"
          value={formData.nome_do_contato}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-triton-accent focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Corporativo
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-triton-accent focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Empresa
        </label>
        <input
          type="text"
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-triton-accent focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-triton-accent focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="observa_es" className="block text-sm font-medium text-gray-700 mb-1">
          Detalhes do Projeto (Opcional)
        </label>
        <textarea
          id="observa_es"
          name="observa_es"
          value={formData.observa_es}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-triton-accent focus:border-transparent"
          rows={4}
        />
      </div>

      {formState.error && (
        <div className="text-center">
          <p className="text-red-600 text-sm">{formState.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full bg-triton-button hover:bg-triton-button/90 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState.isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}