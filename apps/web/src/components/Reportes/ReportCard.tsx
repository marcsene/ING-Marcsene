interface ReportCardProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export function ReportCard({
  icon,
  title,
  description,
  onClick,
}: ReportCardProps) {
  return (
    <button
      className="report-card"
      type="button"
      onClick={onClick}
    >
      <span className="report-card-icon">
        {icon}
      </span>

      <div className="report-card-content">
        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <span className="report-card-arrow">
        →
      </span>
    </button>
  );
}