import { SVGProps } from 'react';

/**
 * @fileoverview Este arquivo contém o logotipo principal da aplicação.
 * Para alterar o logotipo, edite diretamente o código SVG abaixo,
 * ou substitua o componente por um tag <img/> se preferir usar um arquivo de imagem.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 40"
        width="120"
        height="24"
        {...props}
      >
        <text
          x="10"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="currentColor"
        >
          Renascer Tour
        </text>
      </svg>
    );
  }
  
  // Exemplo de como usar um SVG mais complexo, mantido para referência.
  export function ExampleLogo(props: SVGProps<SVGSVGElement>) {
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
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  