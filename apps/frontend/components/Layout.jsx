import Nav from './Nav';

const layoutStyle = {
  display: 'flex', minHeight: '100vh'
};
const mainStyle = {
  flex: 1, padding: 40
};

export default function Layout({ children }) {
  return (
    <div style={layoutStyle}>
      <Nav />
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
