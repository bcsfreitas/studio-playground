/* @ds-bundle: {"format":4,"namespace":"EndlessStudiosDesignSystem_579f42","components":[{"name":"GameTile","sourcePath":"components/brand/GameTile.jsx"},{"name":"PostCard","sourcePath":"components/brand/PostCard.jsx"},{"name":"ProgramTile","sourcePath":"components/brand/ProgramTile.jsx"},{"name":"SkillToken","sourcePath":"components/brand/SkillToken.jsx"},{"name":"TaskTile","sourcePath":"components/brand/TaskTile.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"}],"sourceHashes":{"components/brand/GameTile.jsx":"bf11e90632af","components/brand/PostCard.jsx":"54994a19424c","components/brand/ProgramTile.jsx":"faa48285a277","components/brand/SkillToken.jsx":"4f4cb4f91eba","components/brand/TaskTile.jsx":"a3ed8fa82aef","components/core/Avatar.jsx":"bf374e3ceb6c","components/core/Badge.jsx":"2fb308d488a6","components/core/Button.jsx":"eef2017de9fd","components/core/Card.jsx":"dda9c4fdc06f","ui_kits/studio/FeedScreen.jsx":"eda639ea86f6","ui_kits/studio/GamesScreen.jsx":"be5fabae12f6","ui_kits/studio/LearnScreen.jsx":"d7b39b0bfc35","ui_kits/studio/ProfileScreen.jsx":"eaffd138dd21","ui_kits/studio/StudioShell.jsx":"d9b51fb33d0b","ui_kits/studio/data.js":"e0ab4b9f151e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EndlessStudiosDesignSystem_579f42 = window.EndlessStudiosDesignSystem_579f42 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/GameTile.jsx
try { (() => {
/**
 * A game/project tile from the Games library. Rounded-3xl white card with a
 * cover image, an orange genre tag, a bold title and a member count footer.
 * Lifts on hover (card-general-styles). Mirrors the platform's ProjectTile.
 */
function GameTile({
  image,
  name = 'Untitled game',
  tag,
  members = 0,
  phase,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: '100%',
      background: '#fff',
      border: '1px solid #dcdce9',
      borderRadius: 'var(--radius-2xl, 24px)',
      overflow: 'hidden',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      transition: 'box-shadow var(--duration-base,.25s) ease',
      boxShadow: hover ? 'var(--shadow-hover, 0 10px 19px 7px rgb(156 161 165 / 15%))' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 116,
      background: '#f1f5f9'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), phase && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'rgba(15,23,43,.72)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: 999,
      backdropFilter: 'blur(4px)',
      textTransform: 'uppercase',
      letterSpacing: '.03em'
    }
  }, phase)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderBottom: '1px solid #e2e8f0'
    }
  }, tag ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: 'var(--color-orange-endless, #f76e40)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      padding: '4px 12px',
      borderRadius: 'var(--radius-sm,8px)'
    }
  }, tag) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: 24
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontFamily: 'var(--font-heading, Figtree, sans-serif)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '-0.5px',
      color: 'var(--ui-text-highlighted, #020618)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minHeight: 24
    }
  }, name)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--ui-text-dimmed, #62748e)'
    }
  }, members, " ", members === 1 ? 'member' : 'members')));
}
Object.assign(__ds_scope, { GameTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/GameTile.jsx", error: String((e && e.message) || e) }); }

// components/brand/ProgramTile.jsx
try { (() => {
/**
 * A horizontal learning-program row: square thumbnail, title, two-line
 * description, task count and an optional "In progress" status pill with a
 * status dot. Mirrors the platform's ProgramTile.
 */
function ProgramTile({
  image,
  name = 'Program',
  description = '',
  tasksCount,
  status,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      gap: 16,
      padding: 8,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-2xl, 24px)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      overflow: 'hidden',
      transition: 'box-shadow var(--duration-base,.25s) ease',
      boxShadow: hover ? 'var(--shadow-hover, 0 10px 19px 7px rgb(156 161 165 / 15%))' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: 118,
      height: 118,
      flexShrink: 0,
      objectFit: 'cover',
      borderRadius: 'var(--radius-lg, 16px)',
      background: '#f1f5f9'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '8px 8px 8px 0',
      width: '100%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--ui-text-highlighted, #020618)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--ui-text-dimmed, #62748e)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, tasksCount != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ui-text-dimmed, #62748e)'
    }
  }, tasksCount, " Tasks") : /*#__PURE__*/React.createElement("span", null), status && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-sm,8px)',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--ui-text, #1d293d)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--color-blue-status, #2fb0f8)'
    }
  }), status))));
}
Object.assign(__ds_scope, { ProgramTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ProgramTile.jsx", error: String((e && e.message) || e) }); }

// components/brand/SkillToken.jsx
try { (() => {
/**
 * The rounded-hexagon "skill token" from a learner's profile. A domain-colored
 * hexagon holds a subdomain glyph, with 1–3 star pips above marking the level.
 * Colors follow the five skill domains: Art, Game Design, Engineering,
 * Go to Market, Management & Production.
 */

const DOMAIN_COLOR = {
  'Art': '#ff4db5',
  'Game Design': '#ff6900',
  'Engineering': '#0084d1',
  'Go to Market': '#6556f0',
  'Management & Production': '#00bba7'
};
const SIZES = {
  sm: 48,
  md: 60,
  lg: 80,
  xl: 96
};
const HEX = 'M23.9647 1.48126C27.3899 -0.493752 32.6101 -0.493753 36.0353 1.48126L54.4647 12.1076C57.8899 14.0826 60 17.7325 60 21.6826V38.3174C60 42.2675 57.8899 45.9174 54.4647 47.8924L36.0353 58.5187C32.6101 60.4937 27.3899 60.4937 23.9647 58.5187L5.53535 47.8924C2.11006 45.9174 0 42.2675 0 38.3174V21.6826C0 17.7325 2.11006 14.0826 5.53534 12.1076L23.9647 1.48126Z';
const STAR = 'M5.20466 0.492647C5.54801 -0.164217 6.45199 -0.164215 6.79534 0.492648L8.05187 2.89654C8.18217 3.14581 8.41297 3.32077 8.68046 3.37303L11.26 3.87703C11.9648 4.01475 12.2442 4.91177 11.7515 5.45545L9.94859 7.44513C9.76163 7.65146 9.67347 7.93455 9.70849 8.21612L10.0462 10.9315C10.1385 11.6735 9.40713 12.2279 8.7593 11.907L6.38849 10.7328C6.14264 10.6111 5.85736 10.6111 5.61151 10.7328L3.2407 11.907C2.59287 12.2279 1.86153 11.6735 1.95381 10.9315L2.29151 8.21612C2.32653 7.93455 2.23837 7.65146 2.05141 7.44513L0.248465 5.45545C-0.24419 4.91177 0.0351585 4.01475 0.740015 3.87703L3.31954 3.37303C3.58703 3.32077 3.81783 3.14581 3.94813 2.89654L5.20466 0.492647Z';
function SkillToken({
  domain = 'Game Design',
  icon,
  level,
  size = 'lg',
  style = {}
}) {
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.lg;
  const color = DOMAIN_COLOR[domain] || '#ff6900';
  const pips = level != null ? Math.min(level, 3) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: px * 0.06,
      ...style
    }
  }, pips > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: px * 0.04,
      height: px * 0.2,
      alignItems: 'flex-end'
    }
  }, Array.from({
    length: pips
  }).map((_, i) => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: px * 0.17,
    height: px * 0.17,
    viewBox: "0 0 12 12",
    style: {
      alignSelf: pips === 3 && i !== 1 ? 'flex-end' : 'center'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: STAR,
    fill: "#E48626"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: px,
      height: px
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: px,
    height: px,
    viewBox: "0 0 60 60",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: HEX,
    fill: color
  })), icon && /*#__PURE__*/React.createElement("img", {
    src: icon,
    alt: domain,
    style: {
      position: 'absolute',
      inset: 0,
      margin: 'auto',
      width: px * 0.56,
      height: px * 0.56,
      objectFit: 'contain',
      filter: 'brightness(0) invert(1)'
    }
  })));
}
Object.assign(__ds_scope, { SkillToken });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SkillToken.jsx", error: String((e && e.message) || e) }); }

// components/brand/TaskTile.jsx
try { (() => {
/**
 * A task card from a program/game sprint. Bold title, a colored status pill,
 * and a meta row with the parent game and a due-date dot. Mirrors TaskTile.
 */

const STATUS_BG = {
  'In Review': '#f26522',
  'In Progress': '#f26522',
  'Need help': '#f26522',
  Feedback: '#ffd464',
  Done: '#82d066',
  New: '#2196f3'
};
function TaskTile({
  name = 'Task',
  status,
  project,
  projectImage,
  due,
  dueSoon = false,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: '100%',
      background: '#fff',
      border: '1px solid #dcdce9',
      borderRadius: 'var(--radius-lg, 16px)',
      padding: '28px 24px 16px',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      transition: 'box-shadow var(--duration-base,.25s) ease',
      boxShadow: hover ? 'var(--shadow-hover, 0 10px 19px 7px rgb(156 161 165 / 15%))' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: 'var(--font-heading, Figtree, sans-serif)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '-0.5px',
      color: 'var(--ui-text-highlighted, #020618)'
    }
  }, name), status && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      padding: '4px 8px',
      borderRadius: 'var(--radius-sm,8px)',
      background: STATUS_BG[status] || '#94a3b8',
      color: '#fff',
      fontSize: 10,
      lineHeight: '12px',
      fontWeight: 600
    }
  }, status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginTop: 12
    }
  }, project && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, projectImage && /*#__PURE__*/React.createElement("img", {
    src: projectImage,
    alt: "",
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ui-text-dimmed, #62748e)',
      maxWidth: 120,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, project)), due && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: dueSoon ? 'var(--color-yellow-main,#ffce73)' : 'var(--color-green-light,#7fba7a)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ui-text-dimmed, #62748e)'
    }
  }, due))));
}
Object.assign(__ds_scope, { TaskTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/TaskTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
/** Circular user avatar with graceful fallback to an initial on the brand tint. */

const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 96,
  '3xl': 140
};
function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  ring = false,
  style = {}
}) {
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  const [broken, setBroken] = React.useState(false);
  const initial = (name || alt || '?').trim().charAt(0).toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: px,
      height: px,
      borderRadius: '9999px',
      overflow: 'hidden',
      flexShrink: 0,
      background: '#ffedd5',
      color: '#ca3500',
      fontFamily: 'var(--font-heading, Figtree, sans-serif)',
      fontWeight: 700,
      fontSize: px * 0.42,
      boxShadow: ring ? '0 0 0 3px #fff, 0 0 0 5px #ff6900' : 'none',
      ...style
    }
  }, src && !broken ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    onError: () => setBroken(true),
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/brand/PostCard.jsx
try { (() => {
/**
 * A community-feed post. Rounded-2xl card: author header (avatar, username,
 * time, source + post type), optional image, body text, tags, and a
 * like / comment action bar. Mirrors the platform's PostCard.
 */
function PostCard({
  author = 'creator',
  avatar,
  time = 'just now',
  source,
  postType,
  image,
  children,
  tags = [],
  likes = 0,
  comments = 0,
  liked = false,
  onLike,
  onComment,
  style = {}
}) {
  const [isLiked, setLiked] = React.useState(liked);
  const [count, setCount] = React.useState(likes);
  const toggle = () => {
    setLiked(v => !v);
    setCount(c => c + (isLiked ? -1 : 1));
    onLike && onLike(!isLiked);
  };
  const meta = {
    fontSize: 12,
    color: 'var(--ui-text-dimmed, #62748e)'
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-lg, 16px)',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '20px 20px 0'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: avatar,
    name: author,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--ui-text-highlighted,#020618)'
    }
  }, author), /*#__PURE__*/React.createElement("span", {
    style: meta
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 2
    }
  }, source && /*#__PURE__*/React.createElement("span", {
    style: {
      ...meta,
      fontWeight: 500,
      color: 'var(--ui-secondary,#6556f0)'
    }
  }, source), source && postType && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: '#000'
    }
  }), postType && /*#__PURE__*/React.createElement("span", {
    style: meta
  }, postType))), /*#__PURE__*/React.createElement("span", {
    className: "iconify i-lucide-more-horizontal",
    style: {
      width: 20,
      height: 20,
      color: '#94a3b8',
      flexShrink: 0
    },
    "aria-hidden": true
  })), image && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 12px 0'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      maxHeight: 340,
      objectFit: 'cover',
      borderRadius: 'var(--radius-lg,16px)',
      display: 'block'
    }
  })), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 0',
      fontSize: 14,
      lineHeight: '24px',
      color: 'var(--ui-text,#1d293d)'
    }
  }, children), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      padding: '14px 20px 0'
    }
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: '4px 10px',
      fontSize: 10,
      fontWeight: 700,
      color: 'var(--ui-text-dimmed,#62748e)',
      border: '1px solid #cad5e2',
      borderRadius: 'var(--radius-sm,8px)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      margin: '16px 20px 0',
      padding: '0 0',
      height: 48,
      borderTop: '1px solid #dcdce9'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0 12px',
      fontSize: 13,
      fontWeight: 600,
      color: isLiked ? 'var(--color-orange-endless,#f76e40)' : 'var(--ui-text-dimmed,#62748e)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `iconify ${isLiked ? 'i-lucide-thumbs-up' : 'i-lucide-thumbs-up'}`,
    style: {
      width: 16,
      height: 16
    },
    "aria-hidden": true
  }), "Like"), /*#__PURE__*/React.createElement("button", {
    onClick: onComment,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0 12px',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ui-text-dimmed,#62748e)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconify i-lucide-message-circle",
    style: {
      width: 16,
      height: 16
    },
    "aria-hidden": true
  }), "Comment"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--ui-text-dimmed,#62748e)'
    }
  }, count, " likes"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--ui-text-dimmed,#62748e)'
    }
  }, comments, " comments"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }));
}
Object.assign(__ds_scope, { PostCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PostCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
/**
 * Small status / category label. Soft is the platform default (tinted bg,
 * deep text) — used for interests, genres, post types. Solid for strong tags.
 */

const COLORS = {
  primary: {
    soft: '#ffedd5',
    softText: '#ca3500',
    solid: '#ff6900',
    on: '#fff'
  },
  secondary: {
    soft: '#e7e5fc',
    softText: '#463ca8',
    solid: '#6556f0',
    on: '#fff'
  },
  neutral: {
    soft: '#f1f5f9',
    softText: '#45556c',
    solid: '#1d293d',
    on: '#fff'
  },
  success: {
    soft: '#e5ecdf',
    softText: '#2a4217',
    solid: '#55852e',
    on: '#fff'
  },
  warning: {
    soft: '#fae9d8',
    softText: '#703800',
    solid: '#e07100',
    on: '#fff'
  },
  error: {
    soft: '#fadce2',
    softText: '#6f0d20',
    solid: '#de1b41',
    on: '#fff'
  },
  kids: {
    soft: '#ccfbf1',
    softText: '#00786f',
    solid: '#00bba7',
    on: '#fff'
  }
};
const SIZES = {
  sm: {
    fontSize: 10,
    padding: '2px 8px'
  },
  md: {
    fontSize: 12,
    padding: '3px 10px'
  },
  lg: {
    fontSize: 13,
    padding: '4px 12px'
  }
};
function Badge({
  children,
  color = 'primary',
  variant = 'soft',
  size = 'md',
  style = {}
}) {
  const c = COLORS[color] || COLORS.primary;
  const s = SIZES[size] || SIZES.md;
  const looks = {
    soft: {
      background: c.soft,
      color: c.softText
    },
    solid: {
      background: c.solid,
      color: c.on
    },
    outline: {
      background: 'transparent',
      color: c.softText,
      boxShadow: `inset 0 0 0 1px ${c.soft}`
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      fontWeight: 600,
      fontSize: s.fontSize,
      lineHeight: 1.4,
      padding: s.padding,
      borderRadius: 'var(--radius-sm, 8px)',
      whiteSpace: 'nowrap',
      ...looks[variant],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Endless Studios primary control. Mirrors the platform's Nuxt UI button:
 * rounded, bold label, soft focus ring. Solid primary is the brand orange.
 */

const COLORS = {
  primary: {
    solid: '#ff6900',
    solidHover: '#f54a00',
    on: '#ffffff',
    soft: '#ffedd5',
    softText: '#ca3500',
    softHover: '#ffd6a8',
    ghostHover: '#fff7ed',
    border: '#ff6900'
  },
  secondary: {
    solid: '#6556f0',
    solidHover: '#463ca8',
    on: '#ffffff',
    soft: '#e7e5fc',
    softText: '#322b78',
    softHover: '#d0ccfa',
    ghostHover: '#e7e5fc',
    border: '#6556f0'
  },
  neutral: {
    solid: '#1d293d',
    solidHover: '#0f172b',
    on: '#ffffff',
    soft: '#f1f5f9',
    softText: '#314158',
    softHover: '#e2e8f0',
    ghostHover: '#f1f5f9',
    border: '#cad5e2'
  },
  success: {
    solid: '#55852e',
    solidHover: '#3b5d20',
    on: '#ffffff',
    soft: '#e5ecdf',
    softText: '#2a4217',
    softHover: '#ccdac0',
    ghostHover: '#e5ecdf',
    border: '#55852e'
  },
  error: {
    solid: '#de1b41',
    solidHover: '#9b122d',
    on: '#ffffff',
    soft: '#fadce2',
    softText: '#6f0d20',
    softHover: '#f5bac6',
    ghostHover: '#fadce2',
    border: '#de1b41'
  }
};
const SIZES = {
  sm: {
    fontSize: 12,
    padding: '5px 10px',
    gap: 5,
    icon: 14
  },
  md: {
    fontSize: 14,
    padding: '7px 12px',
    gap: 6,
    icon: 16
  },
  lg: {
    fontSize: 14,
    padding: '9px 16px',
    gap: 6,
    icon: 18
  },
  xl: {
    fontSize: 16,
    padding: '12px 20px',
    gap: 8,
    icon: 20
  }
};
function Button({
  children,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  disabled = false,
  block = false,
  leadingIcon = null,
  trailingIcon = null,
  onClick,
  style = {},
  ...rest
}) {
  const c = COLORS[color] || COLORS.primary;
  const s = SIZES[size] || SIZES.md;
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-sans, Inter, sans-serif)',
    fontWeight: 700,
    fontSize: s.fontSize,
    lineHeight: 1.25,
    padding: variant === 'link' ? 0 : s.padding,
    borderRadius: variant === 'link' ? 0 : 'var(--radius-sm, 8px)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'background var(--duration-base,.25s) ease, color .2s ease',
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  };
  const looks = {
    solid: {
      background: c.solid,
      color: c.on
    },
    outline: {
      background: 'transparent',
      color: c.solid,
      borderColor: c.border
    },
    soft: {
      background: c.soft,
      color: c.softText
    },
    ghost: {
      background: 'transparent',
      color: c.solid
    },
    link: {
      background: 'transparent',
      color: c.solid,
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverLook = !disabled && hover ? {
    solid: {
      background: c.solidHover
    },
    outline: {
      background: c.ghostHover
    },
    soft: {
      background: c.softHover
    },
    ghost: {
      background: c.ghostHover
    },
    link: {
      opacity: 0.8
    }
  }[variant] : {};
  const Icon = ({
    name
  }) => name ? /*#__PURE__*/React.createElement("span", {
    className: `iconify ${name}`,
    style: {
      width: s.icon,
      height: s.icon,
      display: 'inline-block'
    },
    "aria-hidden": true
  }) : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...looks[variant],
      ...hoverLook,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(Icon, {
    name: leadingIcon
  }), children, /*#__PURE__*/React.createElement(Icon, {
    name: trailingIcon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * The platform surface. Rounded-2xl white panel with an optional soft border
 * and header/footer slots. `outline` adds the ambient card shadow; `soft`
 * sits on a muted fill; `hover` lifts on pointer-over (used by clickable tiles).
 */

const VARIANTS = {
  outline: {
    background: '#fff',
    border: '1px solid var(--ui-border, #dcdce9)',
    boxShadow: 'var(--shadow-card, 0 25px 50px -12px rgba(0,0,0,.08))'
  },
  flat: {
    background: '#fff',
    border: '1px solid var(--ui-border, #dcdce9)',
    boxShadow: 'none'
  },
  soft: {
    background: 'var(--ui-bg-elevated, #f1f5f9)',
    border: '1px solid transparent',
    boxShadow: 'none'
  },
  ghost: {
    background: 'transparent',
    border: '1px solid transparent',
    boxShadow: 'none'
  }
};
function Card({
  children,
  header = null,
  footer = null,
  variant = 'flat',
  hover = false,
  padding = 24,
  style = {},
  onClick
}) {
  const v = VARIANTS[variant] || VARIANTS.flat;
  const [hovered, setHovered] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      borderRadius: 'var(--radius-lg, 16px)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      color: 'var(--ui-text, #1d293d)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow var(--duration-base,.25s) ease',
      boxShadow: hover && hovered ? 'var(--shadow-hover, 0 10px 19px 7px rgb(156 161 165 / 15%))' : v.boxShadow,
      ...v,
      ...style
    }
  }, header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      borderBottom: '1px solid var(--ui-border-muted, #e2e8f0)'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      borderTop: '1px solid var(--ui-border-muted, #e2e8f0)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/FeedScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// FeedScreen — the signed-in dashboard: hero banner + community feed + task rail.
const FS = window.EndlessStudiosDesignSystem_579f42;
const FA = '../../assets/';
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      height: 300,
      borderRadius: 'var(--radius-3xl)',
      overflow: 'hidden',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FA + 'img/hero-signed-in.png',
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(0deg, rgba(1,7,10,.55), rgba(1,7,10,.15))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'center',
      color: '#fff',
      padding: 24,
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1.05,
      margin: 0
    }
  }, "Welcome back, let's build"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      margin: '12px 0 20px',
      opacity: .92
    }
  }, "Pick up where you left off, or jump into a community game and start creating."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '14px 24px',
      borderRadius: 100,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--color-orange-primary)',
      background: 'linear-gradient(0deg,#ffe3ba 0%,#fff 87%)'
    }
  }, "Continue learning"), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '14px 24px',
      borderRadius: 100,
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 15,
      color: '#fff',
      background: 'transparent',
      border: '2px solid #fff'
    }
  }, "Explore games"))));
}
function CreatePost() {
  const {
    Avatar,
    Button
  } = FS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: '#fff',
      border: '1px solid var(--ui-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 14,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: window.SD.user.name,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: 'var(--ui-text-dimmed)',
      fontSize: 14
    }
  }, "Post your questions or discussion topics"), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    leadingIcon: "i-lucide-plus"
  }, "New post"));
}
function XpCard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-cornflower-500)',
      color: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 20
    }
  }, "Level 6"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: .85
    }
  }, "1,240 total XP")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: 'rgba(255,255,255,.25)',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '64%',
      height: '100%',
      borderRadius: 999,
      background: '#fff'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 12,
      opacity: .9
    }
  }, "360 XP until level 7"));
}
function FeedScreen() {
  const {
    PostCard,
    TaskTile
  } = FS;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 340px',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 24,
      margin: '0 0 16px'
    }
  }, "Community feed"), /*#__PURE__*/React.createElement(CreatePost, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, window.SD.feed.map((p, i) => /*#__PURE__*/React.createElement(PostCard, _extends({
    key: i
  }, p), p.body)))), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement(XpCard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 18,
      margin: 0
    }
  }, "My tasks"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 13,
      color: 'var(--ui-secondary)',
      textDecoration: 'none',
      fontWeight: 600
    }
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, window.SD.tasks.map((t, i) => /*#__PURE__*/React.createElement(TaskTile, _extends({
    key: i
  }, t)))))));
}
window.FeedScreen = FeedScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/FeedScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/GamesScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// GamesScreen — the games library: featured banner, genre filters, tile grid.
const GS = window.EndlessStudiosDesignSystem_579f42;
const GA = '../../assets/';
const GENRES = ['All', 'Platformer', 'Adventure', 'Racing', 'RPG', 'Puzzle', 'Casual Games'];
function GamesScreen() {
  const {
    GameTile,
    Badge,
    Button
  } = GS;
  const [genre, setGenre] = React.useState('All');
  const games = window.SD.games.filter(g => genre === 'All' || g.tag === genre);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-3xl)',
      overflow: 'hidden',
      background: '#000',
      marginBottom: 32,
      height: 220
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: GA + 'img/endstar-bg.webp',
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(1,7,10,.7), rgba(1,7,10,.1))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 40,
      maxWidth: 520,
      color: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      opacity: .85
    }
  }, "Featured game"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 34,
      margin: '6px 0 10px'
    }
  }, "Threadbare"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      margin: '0 0 18px',
      opacity: .92
    }
  }, "Rebuild an unraveling world with the community."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    color: "secondary",
    size: "lg"
  }, "Open game")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 24,
      margin: 0
    }
  }, "Community games"), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    leadingIcon: "i-lucide-plus"
  }, "Create Game")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 24
    }
  }, GENRES.map(g => /*#__PURE__*/React.createElement("button", {
    key: g,
    onClick: () => setGenre(g),
    style: {
      padding: '7px 14px',
      borderRadius: 999,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      border: '1px solid ' + (genre === g ? 'transparent' : 'var(--ui-border-accented)'),
      background: genre === g ? 'var(--ui-text-highlighted)' : '#fff',
      color: genre === g ? '#fff' : 'var(--ui-text-muted)'
    }
  }, g))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, games.map((g, i) => /*#__PURE__*/React.createElement(GameTile, _extends({
    key: i
  }, g, {
    image: GA + g.image
  })))));
}
window.GamesScreen = GamesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/GamesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/LearnScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// LearnScreen — the learning dashboard: programs in progress + a resource CTA.
const LS = window.EndlessStudiosDesignSystem_579f42;
const LA = '../../assets/';
function LearnScreen() {
  const {
    ProgramTile,
    Button
  } = LS;
  const inProgress = window.SD.programs.filter(p => p.status);
  const more = window.SD.programs.filter(p => !p.status);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 32,
      margin: '0 0 6px'
    }
  }, "Your journey"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ui-text-muted)',
      margin: '0 0 32px'
    }
  }, "Take action in one of your learning and creation experiences."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 320px',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 16px'
    }
  }, "Programs in progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginBottom: 36
    }
  }, inProgress.map((p, i) => /*#__PURE__*/React.createElement(ProgramTile, _extends({
    key: i
  }, p, {
    image: LA + p.image
  })))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 16px'
    }
  }, "All programs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, more.map((p, i) => /*#__PURE__*/React.createElement(ProgramTile, _extends({
    key: i
  }, p, {
    image: LA + p.image
  }))))), /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'radial-gradient(85% 85% at 50% 0%, var(--color-teal-50) 0%, #fff 100%)',
      border: '1px solid var(--ui-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LA + 'icons/key.svg',
    alt: "",
    style: {
      width: 28,
      height: 28,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 17,
      margin: '0 0 4px'
    }
  }, "Have an enrollment code?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--ui-text-muted)',
      margin: '0 0 14px'
    }
  }, "Use it to access a program or particular content."), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    variant: "soft",
    block: true
  }, "Add code")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--ui-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LA + 'icons/joystick.svg',
    alt: "",
    style: {
      width: 26,
      height: 22,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 17,
      margin: '0 0 4px'
    }
  }, "Resource library"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--ui-text-muted)',
      margin: '0 0 14px'
    }
  }, "Explore guides, videos, and files to level up your skills."), /*#__PURE__*/React.createElement(Button, {
    color: "neutral",
    variant: "outline",
    block: true
  }, "Check the library")))));
}
window.LearnScreen = LearnScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/LearnScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/ProfileScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ProfileScreen — a learner profile: identity card, top skills, games, certificates.
const PS = window.EndlessStudiosDesignSystem_579f42;
const PA = '../../assets/';
function ProfileCard() {
  const {
    Card,
    Avatar,
    Badge,
    Button
  } = PS;
  const u = window.SD.user;
  return /*#__PURE__*/React.createElement(Card, {
    variant: "outline",
    padding: 24,
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: u.name,
      size: "3xl"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        margin: '8px 0 0'
      }
    }, u.name)),
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "soft",
      color: "neutral",
      block: true
    }, "Edit profile")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      textTransform: 'uppercase',
      color: 'var(--ui-text-toned)',
      marginBottom: 6
    }
  }, "Games"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PA + 'icons/controller.svg',
    style: {
      width: 20,
      height: 20
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, u.games))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      textTransform: 'uppercase',
      color: 'var(--ui-text-toned)',
      marginBottom: 6
    }
  }, "Certificates"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PA + 'icons/certificate.svg',
    style: {
      width: 20,
      height: 20
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, u.certificates)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--ui-border-muted)',
      margin: '0 -24px 20px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20
    }
  }, u.interests.map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    color: "secondary",
    variant: "soft"
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--ui-border-muted)',
      margin: '0 -24px 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--ui-text-muted)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconify i-lucide-calendar",
    style: {
      width: 18,
      height: 18
    },
    "aria-hidden": true
  }), "Joined ", u.joined));
}
function ProfileScreen() {
  const {
    SkillToken,
    GameTile,
    Card
  } = PS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px minmax(0,1fr)',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(ProfileCard, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 16px'
    }
  }, "Top skills"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--ui-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 20px',
      marginBottom: 32,
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    }
  }, window.SD.skills.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      width: 120
    }
  }, /*#__PURE__*/React.createElement(SkillToken, {
    domain: s.domain,
    icon: PA + 'skills/' + s.icon,
    level: s.level,
    size: "lg"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      textAlign: 'center',
      color: 'var(--ui-text-muted)',
      lineHeight: 1.3
    }
  }, s.name)))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 16px'
    }
  }, "Games"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, window.SD.games.slice(0, 3).map((g, i) => /*#__PURE__*/React.createElement(GameTile, _extends({
    key: i
  }, g, {
    image: PA + g.image
  }))))));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/StudioShell.jsx
try { (() => {
// StudioShell — the sticky white nav + midnight footer wrapper.
// Props: { active, onNav, children }
const {
  Avatar: ShellAvatar,
  Button: ShellButton
} = window.EndlessStudiosDesignSystem_579f42;
const A = '../../assets/';
function NavItem({
  id,
  label,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 500,
      padding: '20px 4px',
      color: active ? 'var(--ui-text-highlighted)' : hover ? 'var(--ui-text)' : 'var(--ui-text-muted)'
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 12,
      height: 2,
      borderRadius: 2,
      background: active ? 'var(--ui-primary)' : 'transparent'
    }
  }));
}
function StudioShell({
  active,
  onNav,
  children
}) {
  const NS = window.EndlessStudiosDesignSystem_579f42;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      background: '#fff',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ui-text)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#fff',
      borderBottom: '1px solid var(--ui-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 32px',
      minHeight: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'black-endless-logo.png',
    alt: "Endless Studios",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(NavItem, {
    label: "Games",
    active: active === 'games',
    onClick: () => onNav('games')
  }), /*#__PURE__*/React.createElement(NavItem, {
    label: "Learning",
    active: active === 'learn',
    onClick: () => onNav('learn')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconify i-lucide-bell",
    style: {
      width: 20,
      height: 20,
      color: 'var(--ui-text-muted)',
      cursor: 'pointer'
    },
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => onNav('profile'),
    style: {
      cursor: 'pointer',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(ShellAvatar, {
    name: window.SD.user.name,
    size: "md"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '32px',
      minHeight: 'calc(100vh - 64px - 320px)'
    }
  }, children), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ui-bg-inverted)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '64px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 80,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'logo-endless-studios-orange.svg',
    alt: "Endless Studios",
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexDirection: 'column'
    }
  }, ['Community', 'Play', 'Learn'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 18,
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexDirection: 'column'
    }
  }, ['Help Center', 'Contact Us'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 18,
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 18,
      textDecoration: 'none'
    }
  }, "Endless Studios"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'var(--color-midnight-200)',
      fontSize: 13
    }
  }, "The youth collaborative game-making studio.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 18,
      textDecoration: 'none'
    }
  }, "Endless Access"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'var(--color-midnight-200)',
      fontSize: 13
    }
  }, "Bringing game-making to every learner.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--color-slate-800)',
      margin: '48px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13
    }
  }, "\xA9 ", new Date().getFullYear(), " Endless Studios. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 13,
      textDecoration: 'none'
    }
  }, "Community Code of Conduct"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 13,
      textDecoration: 'none'
    }
  }, "Terms of Use")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ui-primary)',
      fontWeight: 600,
      fontSize: 13
    }
  }, "English"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-midnight-200)',
      fontWeight: 600,
      fontSize: 13
    }
  }, "Espa\xF1ol"))))));
}
window.StudioShell = StudioShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/StudioShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/data.js
try { (() => {
// Fake data for the Endless Studios UI kit. Loaded before the screens.
window.SD = {
  user: {
    name: 'pixel_pat',
    joined: 'Mar 2025',
    games: 4,
    certificates: 2,
    interests: ['Platformer', 'Pixel Art', 'Narrative'],
    bio: 'Making cozy games and learning something new every sprint.'
  },
  skills: [{
    domain: 'Game Design',
    icon: 'core_gameplay_and_mechanics.svg',
    level: 3,
    name: 'Core Gameplay & Mechanics'
  }, {
    domain: 'Art',
    icon: 'aesthetics_and_visual_design.svg',
    level: 2,
    name: 'Aesthetics & Visual Design'
  }, {
    domain: 'Engineering',
    icon: 'gameplay_and_systems_programming.svg',
    level: 2,
    name: 'Gameplay & Systems Programming'
  }, {
    domain: 'Go to Market',
    icon: 'marketing.svg',
    level: 1,
    name: 'Marketing'
  }, {
    domain: 'Management & Production',
    icon: 'project_and_workflow_management.svg',
    level: 1,
    name: 'Project & Workflow Management'
  }],
  games: [{
    name: 'Candy Collective',
    tag: 'Platformer',
    members: 12,
    phase: 'Alpha',
    image: 'img/games/game-built.png'
  }, {
    name: 'Threadbare',
    tag: 'Adventure',
    members: 48,
    phase: 'Live',
    image: 'img/games/endstar-default.jpg'
  }, {
    name: 'Pixel Racer',
    tag: 'Racing',
    members: 5,
    phase: 'Production',
    image: 'img/generic-image.png'
  }, {
    name: 'Moddable Pong',
    tag: 'Casual Games',
    members: 9,
    phase: 'Beta',
    image: 'img/default-bg.png'
  }, {
    name: 'Ink Drinker',
    tag: 'RPG',
    members: 21,
    phase: 'Recruiting',
    image: 'img/games/endstar-avatar.png'
  }, {
    name: 'Star Weaver',
    tag: 'Puzzle',
    members: 7,
    phase: 'Alpha',
    image: 'img/default-image.png'
  }],
  programs: [{
    name: 'Intro to Game Design',
    description: 'Build your first playable prototype, one task at a time.',
    tasksCount: 8,
    status: 'In progress',
    image: 'img/default-bg.png'
  }, {
    name: 'Pixel Art Foundations',
    description: 'Draw, animate, and export sprite art for your games.',
    tasksCount: 6,
    status: 'In progress',
    image: 'img/generic-image.png'
  }, {
    name: 'Ship Your First Game',
    description: 'Take a project from idea to a shared, playable build.',
    tasksCount: 10,
    image: 'img/games/game-built.png'
  }],
  tasks: [{
    name: 'Design the title screen',
    status: 'In Progress',
    project: 'Candy Collective',
    projectImage: 'img/games/game-built.png',
    due: '3 days'
  }, {
    name: 'Playtest the latest build',
    status: 'Feedback',
    project: 'Threadbare',
    projectImage: 'img/games/endstar-default.jpg',
    due: 'Tomorrow',
    dueSoon: true
  }, {
    name: 'Record sound effects',
    status: 'New',
    project: 'Pixel Racer',
    projectImage: 'img/generic-image.png',
    due: '5 days'
  }],
  feed: [{
    author: 'pixel_pat',
    time: '2 hours ago',
    source: 'Threadbare',
    postType: 'Progress Update',
    tags: ['Level Design', 'Fx'],
    likes: 24,
    comments: 5,
    image: 'img/games/game-built.png',
    body: 'Just shipped the new weaving mechanic — try it in the latest build and let me know what breaks!'
  }, {
    author: 'mika.builds',
    time: '5 hours ago',
    source: 'Intro to Game Design',
    postType: 'Question',
    tags: ['Narrative'],
    likes: 8,
    comments: 12,
    body: 'How do you all keep your dialogue trees from getting tangled? Looking for a system that scales.'
  }, {
    author: 'sol_dev',
    time: 'Yesterday',
    source: 'Candy Collective',
    postType: 'Tip',
    tags: [],
    likes: 41,
    comments: 3,
    body: 'Tip: block out your whole level in grey boxes before you touch art. Saved me a week of rework.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/data.js", error: String((e && e.message) || e) }); }

__ds_ns.GameTile = __ds_scope.GameTile;

__ds_ns.PostCard = __ds_scope.PostCard;

__ds_ns.ProgramTile = __ds_scope.ProgramTile;

__ds_ns.SkillToken = __ds_scope.SkillToken;

__ds_ns.TaskTile = __ds_scope.TaskTile;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

})();
