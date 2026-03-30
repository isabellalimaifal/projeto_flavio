import React from 'react'; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2pdf from 'html2pdf.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const Resume = ({ userData, repos, loading, error }) => {

  if (loading) return <div className="status-msg">Gerando currículo...</div>;
  if (error) return <div className="status-msg error">❌ Usuário não encontrado.</div>;
  if (!userData) return <div className="status-msg empty">Aguardando busca...</div>;

  const languageMap = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });

  const languageData = Object.keys(languageMap)
    .map(key => ({ name: key, value: languageMap[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  const downloadPDF = () => {
    const element = document.getElementById('cv-content');
    const opt = {
      margin:       10,
      filename:     `Curriculo_${userData.login}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="resume-wrapper">
      <button className="btn-download" onClick={downloadPDF}>
        📥 Baixar Currículo em PDF
      </button>

      <div id="cv-content" className="cv-document">
        
        {/* Cabeçalho do CV com Avatar e Dados */}
        <div className="cv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src={userData.avatar_url} alt="Avatar" crossOrigin="anonymous" style={{ width: '120px', borderRadius: '50%' }} />
            <div className="cv-title">
              <h1>{userData.name || userData.login}</h1>
              <h2>@{userData.login}</h2>
              <p>{userData.bio || 'Desenvolvedor(a) de Software'}</p>
              <div className="cv-links">
                {userData.location && <span>📍 {userData.location}</span>}
                {userData.company && <span>💼 {userData.company}</span>}
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="qr-code-section" style={{ textAlign: 'center' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(userData.html_url)}`} 
              alt="QR Code do Perfil" 
              crossOrigin="anonymous"
              style={{ borderRadius: '8px', border: '2px solid #d0d7de', padding: '5px' }}
            />
            <p style={{ fontSize: '10px', marginTop: '5px', color: '#656d76' }}>Escanear Perfil</p>
          </div>
        </div>

        <div className="cv-body">

          {/* Gráfico de Linguagens */}
          <div className="cv-section chart-section">
            <h3>Linguagens Mais Utilizadas</h3>
            {languageData.length > 0 ? (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={languageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p>Nenhuma linguagem detectada.</p>
            )}
          </div>

          {/* Melhores Projetos */}
          <div className="cv-section repos-section">
            <h3>Projetos de Destaque</h3>
            <div className="repos-grid">
              {topRepos.map(repo => (
                <div key={repo.id} className="repo-card">
                  <h4>{repo.name}</h4>
                  <p>{repo.description ? repo.description.substring(0, 60) + '...' : 'Sem descrição'}</p>
                  <div className="repo-meta">
                    <span className="lang">🔵 {repo.language || 'N/A'}</span>
                    <span className="stars">⭐ {repo.stargazers_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="cv-footer">
          Gerado automaticamente via GitSearch API - {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Resume;