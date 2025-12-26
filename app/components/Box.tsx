export default function Box({ title }: { title: string }) {
  return (
    <div className="box">
      <strong>{title}</strong>
    </div>
  );
}
