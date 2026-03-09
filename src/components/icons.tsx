import type { SVGProps } from 'react';

/**
 * @fileoverview Este arquivo contém o logotipo principal da aplicação.
 * Para alterar o logotipo, edite diretamente o código SVG abaixo.
 * A funcionalidade de upload de logo na UI é apenas uma representação visual.
 */

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Representa a letra 'R' estilizada com um caminho/viagem */}
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
