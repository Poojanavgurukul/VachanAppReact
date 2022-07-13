import React from "react";
import { Text, View, Linking, Dimensions, ScrollView } from "react-native";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import ListView from "../../components/ListView.js";
const screenHeight = Dimensions.get("window").height;

const About = (props) => {
  const style = styles(props.colorFile, props.sizeFile);
  const releaseNotes = {
    "1.3.5": ["Bug fixes and performance improvements."],
    "1.3.4.O": ["Code refactoring for better user experience."],
    "1.3.4.B": ["Minor UI responsiveness related bugs were fixed."],
    "1.3.2.F": [
      "Note Editor updated to include Rich Text Format",
      "Bible chapters can be downloaded as PDF",
    ],
    "1.3.2.E": [
      "Enhanced the left panel to include Commentary and Audio",
      "Navigation arrows -Expand/Collapse have been enhanced in various tabs for better user experience.",
    ],
    "1.3.1.O": [
      "React version upgrade to 17.0.2",
      "React-Native version upgrade to 0.64.2",
    ],
    "1.3.0.C": ["Bibles: Dogri DSV", "Audio Bible: Oriya IRV NT, Dogri DSV"],
    "1.3.0.F": [
      "Bible Stories in various languages",
      "M’Cheyne Bible Reading Plan",
    ],
    "1.3.0.B": [
      "Enhanced navigation icon",
      "Colour tray has been hidden when not in use",
    ],
    "1.2.1.B": ["Fixed Google Sync and logout issue on state change"],
    "1.2.0.C": [
      "Bibles: ESV Bible, Haryanvi NT, Bilaspuri NT",
      "Audio Bible: Hindi IRV OT, Punjabi IRV, Bilaspuri NT, Haryanvi NT",
    ],
    "1.2.0.O": ["usfm-grammar version upgrade to 2.0.0"],
    "1.1.2.B": ["Fixed bug on update version alert"],
    "1.1.1.B": ["Fixed Google Authentication issue"],
    "1.1.C": [
      "Bibles: Nagamese NT",
      "Commentary: Bridgeway Bible Commentary (Marathi & Gujarati)",
      "Dictionary: Easton’s Bible Dictionary (English)",
      "Videos: BibleProject (Bengali & Malayalam)",
    ],
    "1.1.F": [
      "Multi-colour highlights",
      "Pinch zoom in and out for reading page",
      "Added Hints section",
      "Added appropriate user-friendly alerts for required screens",
    ],
    "1.1.B": [
      "Fixed known cosmetic issues",
      "Fixed known usability issues",
      "Fixed issues in bookmarks and notes",
      "Fixed issue in sync of Notes data",
      "Fixed issue of duplication in Video pane",
      "Fixed Parallel-view issues",
    ],
    "1.1.O": [
      "Added metadata-based filtering for only published bibles to be displayed on Vachan platforms",
      "Handle use-cases when Bible has only OT or NT books",
    ],
    "1.0.P": [
      "React-Native",
      "Powered by Postgres and Python APIs (VachanEngine) in the back-end.",
    ],
    "1.0.C": [
      "Bibles: Latest versions of IRV Bibles in all available Indian Gateway languages",
      "Commentary: IRV Notes (Hindi) + Bridgeway Bible Commentary (English)",
      "Dictionary: IRV Dictionary (Hindi)",
      "Infographics: VisualUnit (Hindi)",
      "Audio: IRV NT Bible (Hindi)",
      "Video: BibleProject (English, Hindi & Telugu)",
    ],
    "1.0.F": [
      "Clean Bible reading pane with section-headings.",
      "Parallel 2-pane feature to display Bibles, Commentaries etc.",
      "Personalization using simple login.",
      "Bookmarks, Highlights & Notes.",
      "Basic Bible search.",
    ],
    "1.0.BS": [
      "DigitalOcean Spaces with CDN to serve Audio & Video",
      "Firebase for personalisation and synchronisation with website",
    ],
  };
  return (
    <View style={[style.container, { height: screenHeight }]}>
      <ScrollView>
        <View style={style.textContainer}>
          <Text style={style.titleText}>Introduction</Text>
          <Text style={style.textStyle}>
            The VachanGo app is a Bible Study app developed to facilitate
            digital scripture engagement in Indian Languages. It is a companion
            app for the{" "}
            <Text
              style={style.linkText}
              onPress={() => {
                Linking.openURL("https://vachanonline.com");
              }}
            >
              https://vachanonline.com
            </Text>{" "}
            website{"\n"}
          </Text>
          <Text style={style.textStyle}>
            Both the VachanGo Bible app and the VachanOnline.com Bible website
            come to you under aegis of The Vachan Project initiative,
            established to provide free access to Bible Study tools in Indian
            Languages.{"\n"}
          </Text>
          <Text style={style.textStyle}>
            Since the content is brought to you under multiple licensing
            arrangements, it is requested that it not be further redistributed
            in any other format or platform without explicit permission from the
            original copyright owners.
          </Text>
          <Text style={style.titleText}>Content and Technology Partners</Text>
          <Text style={style.textStyle}>
            VachanGo is being made available under a collaborative arrangement
            of Friends of Agape, unfoldingWord, Wycliffe Associates, Crossway,
            Bridgeway Publications, Dusty Sandals, BibleProject, Visual Unit,
            and is brought to you by Bridge Connectivity Solutions Pvt. Ltd.
            (BCS){" "}
            <Text
              style={style.linkText}
              onPress={() => {
                Linking.openURL("https://www.bridgeconn.com");
              }}
            >
              (https://www.bridgeconn.com)
            </Text>{" "}
            who is the localization and technology partner.
          </Text>
          <Text
            style={[style.linkText, style.titleText]}
            onPress={() => {
              Linking.openURL(
                "https://github.com/Bridgeconn/VachanAppReact/releases"
              );
            }}
          >
            GitHub Release Notes
          </Text>
          <Text style={style.titleText}>Release Notes 15/07/2022 v1.3.5</Text>
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.3.5"]} />
          <Text style={style.titleText}>Release Notes 02/04/2022 v1.3.4</Text>
          <Text style={style.heading}>Operations Update:</Text>
          <ListView data={releaseNotes["1.3.4.O"]} />
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.3.4.B"]} />
          <Text style={style.titleText}>Release Notes (01/11/2021) v1.3.2</Text>
          <Text style={style.heading}>Feature Additions:</Text>
          <ListView data={releaseNotes["1.3.2.F"]} />
          <Text style={style.heading}>Enhancements:</Text>
          <ListView data={releaseNotes["1.3.2.E"]} />
          <Text style={style.titleText}>Release Notes (14/09/2021) v1.3.1</Text>
          <Text style={style.heading}>Operations Update:</Text>
          <ListView data={releaseNotes["1.3.1.O"]} />
          <Text style={style.titleText}>Release Notes (13/07/2021) v1.3.0</Text>
          <Text style={style.heading}>
            Content Additions (using Vachan API’s):
          </Text>
          <ListView data={releaseNotes["1.3.0.C"]} />
          <Text style={style.heading}>Feature Additions:</Text>
          <ListView data={releaseNotes["1.3.0.F"]} />
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.3.0.B"]} />
          <Text style={style.titleText}>Release Notes (30/05/2021) v1.2.1</Text>
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.2.1.B"]} />
          <Text style={style.titleText}>Release Notes (28/05/2021) v1.2.0</Text>
          <Text style={style.heading}>
            Content Additions (Using Vachan API’s):
          </Text>
          <ListView data={releaseNotes["1.2.0.C"]} />
          <Text style={style.heading}>Operations Update:</Text>
          <ListView data={releaseNotes["1.2.0.O"]} />
          <Text style={style.titleText}>Release Notes (19/03/2021) v1.1.2</Text>
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.1.2.B"]} />
          <Text style={style.titleText}>Release Notes (17/03/2021) v1.1.1</Text>
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.1.1.B"]} />
          <Text style={style.titleText}>Release Notes (05/03/2021) v1.1</Text>
          <Text style={style.heading}>
            Content Additions (using Vachan API’s):
          </Text>
          <ListView data={releaseNotes["1.1.C"]} />
          <Text style={style.heading}>Feature Additions:</Text>
          <ListView data={releaseNotes["1.1.F"]} />
          <Text style={style.heading}>Bug Fixes:</Text>
          <ListView data={releaseNotes["1.1.B"]} />
          <Text style={style.heading}>Operations Update:</Text>
          <ListView data={releaseNotes["1.1.O"]} />
          <Text style={style.titleText}>Release Notes v1.0</Text>
          <Text style={style.heading}>Platform: </Text>
          <ListView data={releaseNotes["1.0.P"]} />
          <Text style={style.heading}>Content Available :</Text>
          <ListView data={releaseNotes["1.0.C"]} />
          <Text style={style.heading}>Features:</Text>
          <ListView data={releaseNotes["1.0.F"]} />
          <Text style={style.heading}>Backend Services:</Text>
          <ListView data={releaseNotes["1.0.BS"]} />
          <Text style={style.titleText}>Contact Us</Text>
          <Text style={style.textStyle}>thevachanproject@gmail.com</Text>
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(About);
