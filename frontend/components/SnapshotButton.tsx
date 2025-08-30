"use client";

type Props = {
  getPng?: () => string | Promise<string>;
  fileName?: string;
  className?: string;
};

export default function SnapshotButton({
  getPng,
  fileName,
  className = "btn-primary",
}: Props) {
  const handleClick = async () => {
    if (!getPng) return;
    const data = await getPng();
    const a = document.createElement("a");
    a.href = data;
    a.download =
      fileName ??
      `SismoView_${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <button className={className} onClick={handleClick} disabled={!getPng}>
      Capturar PNG
    </button>
  );
}
