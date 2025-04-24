// Tell TypeScript about .md imports
declare module "*.md" {
  const content: string;
  export default content;
}
