package poi_artifact;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.swing.text.Document;
import javax.swing.text.rtf.RTFEditorKit;

public class POI {
	public static void main(String[] args) throws IOException, BadLocationException {
		runConversion();		
	}
	
	private static void runConversion() throws IOException {
		String outDir = "/Users/vishal/work/CV_OUT/";
		Path filePath = Paths.get("/Users/vishal/work/Cv's");
		List<String> fileNames = new ArrayList<String>();
		List<String> oMetaList = new ArrayList<String>();
		fileNames = getFileNames(fileNames, filePath);
		int i = 1;
		for(String dPath : fileNames){
			try{
				String fName = "r" + Integer.toString(i) + ".txt";
				String tPath = outDir + fName;
				convertToTextFile(dPath, tPath);
				oMetaList.add(fName + "@@__@@" + dPath);
				i++;
			}
			catch(Exception e){
				System.out.println(dPath);
			}
		}
		FileWriter writer = new FileWriter(outDir + "zinfo.txt"); 
		for(String str: oMetaList) {
		  writer.write(str);
		  writer.write("\n");
		}
		writer.close();
	}
	
	private static List<String> getFileNames(List<String> fileNames, Path dir) {
	    try(DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
	        for (Path path : stream) {
	            if(path.toFile().isDirectory()) {
	                getFileNames(fileNames, path);
	            } else {
	                fileNames.add(path.toAbsolutePath().toString());
	                //System.out.println(path.toAbsolutePath().toString());
	            }
	        }
	    } catch(IOException e) {
	        e.printStackTrace();
	    }
	    return fileNames;
	} 
	
	private static void convertToTextFile(String docFilePath, String txtFilePath) throws IOException, BadLocationException{
		if(docFilePath.endsWith(".rtf")){
			convertRtfToTextFile(docFilePath, txtFilePath);
		}
		else if(docFilePath.endsWith(".txt")){
			String content = new String(Files.readAllBytes(Paths.get(docFilePath)));
			content = removeSpecialCharacters(content);
			FileWriter writer = new FileWriter(txtFilePath); 
			writer.write(content);
			writer.close();
		}
		else{
			convertDocToTextFile(docFilePath, txtFilePath);
		}
	}
	
	private static void convertDocToTextFile(String docFilePath, String txtFilePath) throws IOException{
		FileInputStream fs = new FileInputStream(docFilePath);
		HWPFDocument doc = new HWPFDocument(fs);
		WordExtractor ext = new WordExtractor(doc);
		FileWriter writer = new FileWriter(txtFilePath); 
		writer.write(removeSpecialCharacters(ext.getText()));
		writer.close();
		ext.close();
		fs.close();
	}
	
	private static void convertRtfToTextFile(String docFilePath, String txtFilePath) throws IOException, BadLocationException{
		FileInputStream stream = new FileInputStream(docFilePath);
		RTFEditorKit kit = new RTFEditorKit();
		Document doc = kit.createDefaultDocument();
		kit.read(stream, doc, 0);
		String plainText = removeSpecialCharacters(doc.getText(0, doc.getLength()));
		FileWriter writer = new FileWriter(txtFilePath); 
		writer.write(plainText);
		writer.close();
	}
	
	private static String removeSpecialCharacters(String orgString){
		String str = orgString.toLowerCase();
		str = str.replaceAll("\"", "").replaceAll("'", "").replaceAll("\t", " ");
		str = str.replaceAll(":", "").replaceAll("‘", "").replaceAll("”", "").replaceAll("“", "");
		str = str.replaceAll("’", "");
		str = str.replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("\\\\", "");
		str = str.replaceAll("\f", "");
		return str;
	}
}
